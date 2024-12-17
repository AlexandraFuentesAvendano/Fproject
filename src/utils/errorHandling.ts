interface ErrorDetails {
    code?: string;
    message: string;
    context?: Record<string, any>;
    timestamp: string;
}

class AppError extends Error {
    code: string;
    context?: Record<string, any>;
    timestamp: string;

    constructor(code: string, message: string, context?: Record<string, any>) {
        super(message);
        this.name = 'AppError';
        this.code = code;
        this.context = context;
        this.timestamp = new Date().toISOString();
    }
}

const ERROR_CODES = {
    REVIT_DATA_LOAD: 'REVIT_DATA_LOAD',
    REVIT_DATA_SAVE: 'REVIT_DATA_SAVE',
    CALCULATION: 'CALCULATION',
    VALIDATION: 'VALIDATION',
    NETWORK: 'NETWORK',
    UNKNOWN: 'UNKNOWN',
} as const;

const ERROR_MESSAGES = {
    [ERROR_CODES.REVIT_DATA_LOAD]: 'Error al cargar datos de Revit',
    [ERROR_CODES.REVIT_DATA_SAVE]: 'Error al guardar datos en Revit',
    [ERROR_CODES.CALCULATION]: 'Error en cálculos',
    [ERROR_CODES.VALIDATION]: 'Error de validación',
    [ERROR_CODES.NETWORK]: 'Error de conexión',
    [ERROR_CODES.UNKNOWN]: 'Error desconocido',
} as const;

export function handleError(error: unknown, source: string): ErrorDetails {
    console.error(`Error in ${source}:`, error);

    let errorDetails: ErrorDetails;

    if (error instanceof AppError) {
        errorDetails = {
            code: error.code,
            message: error.message,
            context: error.context,
            timestamp: error.timestamp,
        };
    } else if (error instanceof Error) {
        errorDetails = {
            code: ERROR_CODES.UNKNOWN,
            message: error.message,
            timestamp: new Date().toISOString(),
        };
    } else {
        errorDetails = {
            code: ERROR_CODES.UNKNOWN,
            message: ERROR_MESSAGES[ERROR_CODES.UNKNOWN],
            timestamp: new Date().toISOString(),
        };
    }

    // Log error to console with full details
    console.error('Error Details:', {
        ...errorDetails,
        source,
        stack: error instanceof Error ? error.stack : undefined,
    });

    return errorDetails;
}

export function createError(
    code: keyof typeof ERROR_CODES,
    customMessage?: string,
    context?: Record<string, any>
): AppError {
    const message = customMessage || ERROR_MESSAGES[code];
    return new AppError(code, message, context);
}

export function isNetworkError(error: unknown): boolean {
    if (error instanceof Error) {
        return (
            error.message.includes('network') ||
            error.message.includes('Network') ||
            error.message.includes('fetch') ||
            error.message.includes('connection')
        );
    }
    return false;
}

export function getErrorMessage(error: unknown): string {
    if (error instanceof AppError) {
        return error.message;
    }
    if (error instanceof Error) {
        return error.message;
    }
    if (typeof error === 'string') {
        return error;
    }
    return ERROR_MESSAGES[ERROR_CODES.UNKNOWN];
}

export function logError(error: unknown, context?: Record<string, any>): void {
    const errorDetails = {
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? {
            name: error.name,
            message: error.message,
            stack: error.stack,
        } : error,
        context,
    };

    // In development, log to console
    if (process.env.NODE_ENV === 'development') {
        console.error('Application Error:', errorDetails);
    }

    // In production, you might want to send this to a logging service
    // For now, we'll just log to console
    console.error('Application Error:', errorDetails);
}

export const ErrorUtils = {
    handleError,
    createError,
    isNetworkError,
    getErrorMessage,
    logError,
    ERROR_CODES,
    ERROR_MESSAGES,
};

export default ErrorUtils;

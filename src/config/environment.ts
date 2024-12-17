// API Configuration
export const API_CONFIG = {
    BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
    TIMEOUT: 30000, // 30 seconds
    RETRY_ATTEMPTS: 3,
    RETRY_DELAY: 1000, // 1 second
};

// Map Configuration
export const MAP_CONFIG = {
    CESIUM_TOKEN: import.meta.env.VITE_CESIUM_ACCESS_TOKEN || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI0MzAyNzUyNy1mNmRiLTQyNTQtOWQ3Mi0wYjI3MmVkNmRkOGQiLCJpZCI6MTc5NDY2LCJpYXQiOjE3MDI1MTQxMzF9.YVacpRW5JvO5YE-8hxE8kUteE6rEF9DXwzlN2DHWiFw',
    DEFAULT_LOCATION: {
        latitude: 40.7128,
        longitude: -74.0060,
    },
    DEFAULT_ZOOM: 16,
    MIN_ZOOM: 10,
    MAX_ZOOM: 20,
};

// Light Simulation Configuration
export const LIGHT_CONFIG = {
    DEFAULT_CLOUD_COVER: 0,
    DEFAULT_ARTIFICIAL_LIGHT: 0,
    MIN_INTENSITY: 0,
    MAX_INTENSITY: 1,
    DEFAULT_INTENSITY: 0.5,
    MIN_AMBIENT: 0.1,
    MAX_AMBIENT: 0.5,
    CLOUD_COVER_STEPS: 10,
    TIME_STEPS: 24,
    MATERIALS: {
        'glass-clear': {
            name: 'Vidrio Claro',
            transmittance: 0.9,
            cost: 100,
            sustainability: 0.7,
        },
        'glass-tinted': {
            name: 'Vidrio Tintado',
            transmittance: 0.6,
            cost: 150,
            sustainability: 0.8,
        },
        'glass-low-e': {
            name: 'Vidrio Bajo Emisivo',
            transmittance: 0.7,
            cost: 200,
            sustainability: 0.9,
        },
        'glass-reflective': {
            name: 'Vidrio Reflectivo',
            transmittance: 0.4,
            cost: 250,
            sustainability: 0.85,
        },
    },
};

// Energy Analysis Configuration
export const ENERGY_CONFIG = {
    MIN_VALUE: 0,
    MAX_VALUE: 10,
    VISUALIZATION_RADIUS: 5,
    CYLINDER_HEIGHT_FACTOR: 2,
    COLOR_SCALE: {
        LOW: '#2196f3',    // Blue
        MEDIUM: '#ffeb3b', // Yellow
        HIGH: '#f44336',   // Red
    },
    ORIENTATIONS: {
        NORTH: 0,
        EAST: 90,
        SOUTH: 180,
        WEST: -90,
    },
};

// UI Configuration
export const UI_CONFIG = {
    THEME: {
        PRIMARY_COLOR: '#1976d2',
        SECONDARY_COLOR: '#dc004e',
        SUCCESS_COLOR: '#4caf50',
        ERROR_COLOR: '#f44336',
        WARNING_COLOR: '#ff9800',
        INFO_COLOR: '#2196f3',
    },
    ANIMATION: {
        DURATION: 300,
        EASING: 'cubic-bezier(0.4, 0, 0.2, 1)',
    },
    LAYOUT: {
        DRAWER_WIDTH: 240,
        HEADER_HEIGHT: 64,
        FOOTER_HEIGHT: 48,
    },
};

// File Configuration
export const FILE_CONFIG = {
    ACCEPTED_TYPES: ['.json', '.revit'],
    MAX_SIZE: 10 * 1024 * 1024, // 10MB
    CHUNK_SIZE: 1024 * 1024, // 1MB for chunked uploads
};

// Error Messages
export const ERROR_MESSAGES = {
    NETWORK: 'Error de conexión. Por favor, verifica tu conexión a internet.',
    SERVER: 'Error del servidor. Por favor, intenta más tarde.',
    VALIDATION: 'Por favor, verifica los datos ingresados.',
    NOT_FOUND: 'Recurso no encontrado.',
    UNAUTHORIZED: 'No tienes permiso para realizar esta acción.',
    UNKNOWN: 'Ha ocurrido un error inesperado.',
    DATA_LOAD: 'Error al cargar los datos de energía.',
};

// Success Messages
export const SUCCESS_MESSAGES = {
    SAVE: 'Cambios guardados exitosamente.',
    UPDATE: 'Actualización completada.',
    DELETE: 'Elemento eliminado exitosamente.',
    DATA_LOAD: 'Datos de energía cargados exitosamente.',
};

// Environment Configuration
export const ENV_CONFIG = {
    IS_DEVELOPMENT: import.meta.env.DEV,
    IS_PRODUCTION: import.meta.env.PROD,
    MODE: import.meta.env.MODE,
    BASE_URL: import.meta.env.BASE_URL,
};

// Export all configurations
export const CONFIG = {
    API: API_CONFIG,
    MAP: MAP_CONFIG,
    LIGHT: LIGHT_CONFIG,
    ENERGY: ENERGY_CONFIG,
    UI: UI_CONFIG,
    FILE: FILE_CONFIG,
    ERROR_MESSAGES,
    SUCCESS_MESSAGES,
    ENV: ENV_CONFIG,
};

export default CONFIG;

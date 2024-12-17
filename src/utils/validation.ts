import { BuildingData } from '../context/BuildingContext';

interface ValidationError {
    field: string;
    message: string;
}

export function validateBuildingData(data: Partial<BuildingData>): ValidationError[] {
    const errors: ValidationError[] = [];

    // Validate name
    if (!data.name) {
        errors.push({
            field: 'name',
            message: 'El nombre del proyecto es requerido',
        });
    }

    // Validate location
    if (data.location) {
        if (typeof data.location.latitude !== 'number' ||
            data.location.latitude < -90 ||
            data.location.latitude > 90) {
            errors.push({
                field: 'location.latitude',
                message: 'Latitud inválida. Debe estar entre -90 y 90 grados',
            });
        }

        if (typeof data.location.longitude !== 'number' ||
            data.location.longitude < -180 ||
            data.location.longitude > 180) {
            errors.push({
                field: 'location.longitude',
                message: 'Longitud inválida. Debe estar entre -180 y 180 grados',
            });
        }
    } else {
        errors.push({
            field: 'location',
            message: 'La ubicación es requerida',
        });
    }

    // Validate dimensions
    if (data.dimensions) {
        if (typeof data.dimensions.width !== 'number' || data.dimensions.width <= 0) {
            errors.push({
                field: 'dimensions.width',
                message: 'El ancho debe ser un número positivo',
            });
        }

        if (typeof data.dimensions.length !== 'number' || data.dimensions.length <= 0) {
            errors.push({
                field: 'dimensions.length',
                message: 'El largo debe ser un número positivo',
            });
        }

        if (typeof data.dimensions.height !== 'number' || data.dimensions.height <= 0) {
            errors.push({
                field: 'dimensions.height',
                message: 'La altura debe ser un número positivo',
            });
        }
    } else {
        errors.push({
            field: 'dimensions',
            message: 'Las dimensiones son requeridas',
        });
    }

    // Validate orientation
    if (typeof data.orientation !== 'number' ||
        data.orientation < 0 ||
        data.orientation > 360) {
        errors.push({
            field: 'orientation',
            message: 'La orientación debe estar entre 0 y 360 grados',
        });
    }

    // Validate materials
    if (data.materials) {
        if (!data.materials.windows) {
            errors.push({
                field: 'materials.windows',
                message: 'El material de las ventanas es requerido',
            });
        }
    } else {
        errors.push({
            field: 'materials',
            message: 'Los materiales son requeridos',
        });
    }

    return errors;
}

export function validateLightingParameters(params: {
    date?: Date;
    cloudCover?: number;
    artificialLight?: number;
    material?: string;
}): ValidationError[] {
    const errors: ValidationError[] = [];

    // Validate date
    if (!params.date || !(params.date instanceof Date) || isNaN(params.date.getTime())) {
        errors.push({
            field: 'date',
            message: 'La fecha y hora son requeridas',
        });
    }

    // Validate cloud cover
    if (typeof params.cloudCover !== 'number' ||
        params.cloudCover < 0 ||
        params.cloudCover > 1) {
        errors.push({
            field: 'cloudCover',
            message: 'La nubosidad debe estar entre 0 y 1',
        });
    }

    // Validate artificial light
    if (typeof params.artificialLight !== 'number' ||
        params.artificialLight < 0 ||
        params.artificialLight > 1) {
        errors.push({
            field: 'artificialLight',
            message: 'La luz artificial debe estar entre 0 y 1',
        });
    }

    // Validate material
    if (!params.material) {
        errors.push({
            field: 'material',
            message: 'El material es requerido',
        });
    }

    return errors;
}

export function validateCoordinates(lat: number, lon: number): boolean {
    return (
        typeof lat === 'number' &&
        typeof lon === 'number' &&
        lat >= -90 &&
        lat <= 90 &&
        lon >= -180 &&
        lon <= 180
    );
}

export function validateDimensions(width: number, length: number, height: number): boolean {
    return (
        typeof width === 'number' &&
        typeof length === 'number' &&
        typeof height === 'number' &&
        width > 0 &&
        length > 0 &&
        height > 0
    );
}

export function validateOrientation(angle: number): boolean {
    return typeof angle === 'number' && angle >= 0 && angle < 360;
}

export function validateMaterial(material: string): boolean {
    const validMaterials = [
        'glass-clear',
        'glass-tinted',
        'glass-low-e',
        'glass-reflective',
    ];
    return validMaterials.includes(material);
}

export function formatValidationErrors(errors: ValidationError[]): string {
    return errors
        .map(error => `${error.field}: ${error.message}`)
        .join('\n');
}

export const ValidationUtils = {
    validateBuildingData,
    validateLightingParameters,
    validateCoordinates,
    validateDimensions,
    validateOrientation,
    validateMaterial,
    formatValidationErrors,
};

export default ValidationUtils;

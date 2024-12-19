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
            message: 'Project name is required',
        });
    }

    // Validate location
    if (data.location) {
        if (typeof data.location.latitude !== 'number' ||
            data.location.latitude < -90 ||
            data.location.latitude > 90) {
            errors.push({
                field: 'location.latitude',
                message: 'Invalid latitude. It should be between -90 and 90 degrees',
            });
        }

        if (typeof data.location.longitude !== 'number' ||
            data.location.longitude < -180 ||
            data.location.longitude > 180) {
            errors.push({
                field: 'location.longitude',
                message: 'Invalid length. It should be between -180 and 180 degrees',
            });
        }
    } else {
        errors.push({
            field: 'location',
            message: 'Location is required',
        });
    }

    // Validate dimensions
    if (data.dimensions) {
        if (typeof data.dimensions.width !== 'number' || data.dimensions.width <= 0) {
            errors.push({
                field: 'dimensions.width',
                message: 'Width must be a positive number',
            });
        }

        if (typeof data.dimensions.length !== 'number' || data.dimensions.length <= 0) {
            errors.push({
                field: 'dimensions.length',
                message: 'The length must be a positive number',
            });
        }

        if (typeof data.dimensions.height !== 'number' || data.dimensions.height <= 0) {
            errors.push({
                field: 'dimensions.height',
                message: 'The height must be a positive number',
            });
        }
    } else {
        errors.push({
            field: 'dimensions',
            message: 'Dimensions are required',
        });
    }

    // Validate orientation
    if (typeof data.orientation !== 'number' ||
        data.orientation < 0 ||
        data.orientation > 360) {
        errors.push({
            field: 'orientation',
            message: 'The orientation must be between 0 and 360 degrees',
        });
    }

    // Validate materials
    if (data.materials) {
        if (!data.materials.windows) {
            errors.push({
                field: 'materials.windows',
                message: 'Window material is required',
            });
        }
    } else {
        errors.push({
            field: 'materials',
            message: 'Materials are required',
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
            message: 'Date and time are required',
        });
    }

    // Validate cloud cover
    if (typeof params.cloudCover !== 'number' ||
        params.cloudCover < 0 ||
        params.cloudCover > 1) {
        errors.push({
            field: 'cloudCover',
            message: 'Cloudiness must be between 0 and 1',
        });
    }

    // Validate artificial light
    if (typeof params.artificialLight !== 'number' ||
        params.artificialLight < 0 ||
        params.artificialLight > 1) {
        errors.push({
            field: 'artificialLight',
            message: 'Artificial light must be between 0 and 1',
        });
    }

    // Validate material
    if (!params.material) {
        errors.push({
            field: 'material',
            message: 'The material is required',
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

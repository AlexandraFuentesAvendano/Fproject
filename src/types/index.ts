// Building Data Types
export interface Location {
    latitude: number;
    longitude: number;
}

export interface Dimensions {
    width: number;
    length: number;
    height: number;
}

export interface Materials {
    windows: string;
    walls?: string;
    roof?: string;
}

export interface BuildingData {
    name: string;
    location: Location;
    dimensions: Dimensions;
    orientation: number;
    materials: Materials;
}

// Energy Data Types
export interface EnergyData {
    area: number;
    orientacion: number;
    material: string;
    energia: number;
}

export interface EnergyMetrics {
    byOrientation: OrientationMetrics[];
    overall: OverallMetrics;
}

export interface OrientationMetrics {
    orientation: number;
    totalEnergy: number;
    totalArea: number;
    averageEnergy: number;
    energyDensity: number;
    count: number;
}

export interface OverallMetrics {
    totalEnergy: number;
    totalArea: number;
    averageEnergy: number;
    orientationCount: number;
    windowCount: number;
}

// Light Simulation Types
export interface SunPosition {
    azimuth: number;
    elevation: number;
}

export interface LightIntensity {
    direct: number;
    ambient: number;
}

export interface MaterialProperties {
    name: string;
    transmittance: number;
    cost: number;
    sustainability: number;
}

export interface LightingParameters {
    date: Date;
    cloudCover: number;
    artificialLight: number;
    material: string;
}

export interface LightCalculationResult {
    naturalLight: number;
    artificialLight: number;
    totalIlluminance: number;
    energyEfficiency: number;
}

// UI Types
export interface LoadingState {
    isLoading: boolean;
    message?: string;
}

export interface ErrorState {
    hasError: boolean;
    message?: string;
    code?: string;
    details?: Record<string, any>;
}

export interface ValidationError {
    field: string;
    message: string;
}

// Chart Types
export interface ChartData {
    labels: string[];
    datasets: ChartDataset[];
}

export interface ChartDataset {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
    borderWidth?: number;
}

export interface ChartOptions {
    responsive?: boolean;
    maintainAspectRatio?: boolean;
    plugins?: {
        legend?: {
            position?: 'top' | 'bottom' | 'left' | 'right';
            display?: boolean;
        };
        title?: {
            display?: boolean;
            text?: string;
        };
        tooltip?: {
            enabled?: boolean;
            callbacks?: Record<string, Function>;
        };
    };
    scales?: {
        x?: {
            title?: {
                display?: boolean;
                text?: string;
            };
        };
        y?: {
            title?: {
                display?: boolean;
                text?: string;
            };
            beginAtZero?: boolean;
        };
    };
}

// API Response Types
export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: {
        code: string;
        message: string;
        details?: Record<string, any>;
    };
}

// Environment Types
export interface EnvironmentConfig {
    API_BASE_URL: string;
    CESIUM_TOKEN: string;
    IS_DEVELOPMENT: boolean;
    IS_PRODUCTION: boolean;
}

// Theme Types
export interface ThemeColors {
    primary: string;
    secondary: string;
    success: string;
    error: string;
    warning: string;
    info: string;
    background: string;
    surface: string;
    text: string;
}

export interface ThemeConfig {
    colors: ThemeColors;
    spacing: number;
    borderRadius: number;
    transitions: {
        duration: number;
        easing: string;
    };
    breakpoints: {
        xs: number;
        sm: number;
        md: number;
        lg: number;
        xl: number;
    };
}

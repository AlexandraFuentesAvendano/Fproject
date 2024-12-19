// Application Routes
export const ROUTES = {
    HOME: '/',
    LIGHT_SIMULATION: '/light-simulation',
    ENERGY_ANALYSIS: '/energy-analysis',
    SETTINGS: '/settings',
} as const;

// Material Options
export const MATERIALS = {
    GLASS_CLEAR: {
        id: 'glass-clear',
        name: 'Glass clear',
        transmittance: 0.9,
        cost: 100,
        sustainability: 0.7,
        thumbnail: '/materials/glass-clear.jpg',
    },
    GLASS_TINTED: {
        id: 'glass-tinted',
        name: 'Glass tinted',
        transmittance: 0.6,
        cost: 150,
        sustainability: 0.8,
        thumbnail: '/materials/glass-tinted.jpg',
    },
    GLASS_LOW_E: {
        id: 'glass-low-e',
        name: 'Glass low e',
        transmittance: 0.7,
        cost: 200,
        sustainability: 0.9,
        thumbnail: '/materials/glass-low-e.jpg',
    },
    GLASS_REFLECTIVE: {
        id: 'glass-reflective',
        name: 'Glass-reflective',
        transmittance: 0.4,
        cost: 250,
        sustainability: 0.85,
        thumbnail: '/materials/glass-reflective.jpg',
    },
} as const;

// Chart Colors
export const CHART_COLORS = {
    NATURAL_LIGHT: '#2196F3', // Blue
    ARTIFICIAL_LIGHT: '#f44336', // Red
    ENERGY_LOW: '#4CAF50', // Green
    ENERGY_MEDIUM: '#FFC107', // Amber
    ENERGY_HIGH: '#F44336', // Red
} as const;

// Cardinal Directions
export const DIRECTIONS = {
    NORTH: 0,
    NORTHEAST: 45,
    EAST: 90,
    SOUTHEAST: 135,
    SOUTH: 180,
    SOUTHWEST: 225,
    WEST: 270,
    NORTHWEST: 315,
} as const;

// Time Constants
export const TIME = {
    HOURS_IN_DAY: 24,
    MINUTES_IN_HOUR: 60,
    SECONDS_IN_MINUTE: 60,
    MILLISECONDS_IN_SECOND: 1000,
} as const;

// Units
export const UNITS = {
    AREA: 'm²',
    ENERGY: 'kWh/m²',
    TEMPERATURE: '°C',
    ANGLE: '°',
    PERCENTAGE: '%',
    CURRENCY: '$',
} as const;

// Default Values
export const DEFAULTS = {
    LOCATION: {
        latitude: 40.7128,
        longitude: -74.0060,
    },
    CLOUD_COVER: 0,
    ARTIFICIAL_LIGHT: 0,
    MATERIAL: MATERIALS.GLASS_CLEAR.id,
    MAP_ZOOM: 16,
    DATE: new Date(),
} as const;

// Chart Options
export const CHART_OPTIONS = {
    PIE: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom' as const,
            },
            tooltip: {
                callbacks: {
                    label: (context: any) => {
                        const label = context.label || '';
                        const value = context.raw || 0;
                        return `${label}: ${value.toFixed(1)}%`;
                    },
                },
            },
        },
    },
    BAR: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top' as const,
            },
        },
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    },
} as const;

// Validation Constants
export const VALIDATION = {
    MIN_LATITUDE: -90,
    MAX_LATITUDE: 90,
    MIN_LONGITUDE: -180,
    MAX_LONGITUDE: 180,
    MIN_CLOUD_COVER: 0,
    MAX_CLOUD_COVER: 1,
    MIN_LIGHT_INTENSITY: 0,
    MAX_LIGHT_INTENSITY: 1,
} as const;

// Animation Constants
export const ANIMATION = {
    DURATION: 300,
    EASING: 'cubic-bezier(0.4, 0, 0.2, 1)',
} as const;

// Layout Constants
export const LAYOUT = {
    DRAWER_WIDTH: 240,
    HEADER_HEIGHT: 64,
    FOOTER_HEIGHT: 48,
    CONTENT_MAX_WIDTH: 1200,
} as const;

// Error Messages
export const ERROR_MESSAGES = {
    NETWORK: 'Error de conexión. Por favor, verifica tu conexión a internet.',
    DATA_LOAD: 'Error al cargar los datos.',
    INVALID_INPUT: 'Por favor, verifica los datos ingresados.',
    CALCULATION: 'Error en los cálculos.',
    UNKNOWN: 'Ha ocurrido un error inesperado.',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
    DATA_SAVED: 'Datos guardados exitosamente.',
    CALCULATION_COMPLETE: 'Cálculos completados exitosamente.',
} as const;

// Export all constants
export const CONSTANTS = {
    ROUTES,
    MATERIALS,
    CHART_COLORS,
    DIRECTIONS,
    TIME,
    UNITS,
    DEFAULTS,
    CHART_OPTIONS,
    VALIDATION,
    ANIMATION,
    LAYOUT,
    ERROR_MESSAGES,
    SUCCESS_MESSAGES,
} as const;

export default CONSTANTS;

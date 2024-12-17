import { validateOrientation } from './validation';

// Normalize angle to 0-360 range
export function normalizeAngle(angle: number): number {
    angle = angle % 360;
    return angle < 0 ? angle + 360 : angle;
}

// Convert orientation angle to cardinal direction
export function getCardinalDirection(angle: number): string {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SO', 'O', 'NO'];
    const index = Math.round(((angle % 360) / 45)) % 8;
    return directions[index];
}

// Format coordinates for display
export function formatCoordinates(lat: number, lon: number): string {
    return `${lat.toFixed(6)}°, ${lon.toFixed(6)}°`;
}

// Convert degrees to radians
export function degreesToRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
}

// Convert radians to degrees
export function radiansToDegrees(radians: number): number {
    return radians * (180 / Math.PI);
}

// Format dimensions for display
export function formatDimensions(width: number, length: number, height: number): string {
    return `${width.toFixed(2)}m × ${length.toFixed(2)}m × ${height.toFixed(2)}m`;
}

// Format area for display
export function formatArea(area: number): string {
    return `${area.toFixed(2)} m²`;
}

// Format energy for display
export function formatEnergy(energy: number): string {
    return `${energy.toFixed(2)} kWh/m²`;
}

// Format percentage for display
export function formatPercentage(value: number): string {
    return `${(value * 100).toFixed(1)}%`;
}

// Convert orientation to angle
export function orientationToAngle(orientation: string): number {
    const directions: { [key: string]: number } = {
        'N': 0,
        'NE': 45,
        'E': 90,
        'SE': 135,
        'S': 180,
        'SO': 225,
        'O': 270,
        'NO': 315,
    };
    return directions[orientation.toUpperCase()] || 0;
}

// Sanitize orientation angle
export function sanitizeOrientation(angle: number): number {
    angle = normalizeAngle(angle);
    return validateOrientation(angle) ? angle : 0;
}

// Convert time to hour angle
export function timeToHourAngle(date: Date): number {
    const hours = date.getHours() + date.getMinutes() / 60;
    return (hours - 12) * 15; // 15 degrees per hour
}

// Calculate solar position
export function calculateSolarPosition(date: Date, latitude: number, longitude: number) {
    // Convert to Julian date
    const julianDate = (date.getTime() / 86400000) + 2440587.5;
    const julianCentury = (julianDate - 2451545) / 36525;

    // Calculate solar declination
    const obliquityCorrection = 23.43929111 - julianCentury * (46.815 + julianCentury * (0.00059 - julianCentury * 0.001813));
    const declinationRad = degreesToRadians(obliquityCorrection);

    // Calculate hour angle
    const hourAngle = timeToHourAngle(date);
    const hourAngleRad = degreesToRadians(hourAngle);

    // Calculate solar elevation
    const latRad = degreesToRadians(latitude);
    const elevation = Math.asin(
        Math.sin(latRad) * Math.sin(declinationRad) +
        Math.cos(latRad) * Math.cos(declinationRad) * Math.cos(hourAngleRad)
    );

    // Calculate solar azimuth
    const azimuth = Math.atan2(
        Math.sin(hourAngleRad),
        Math.cos(hourAngleRad) * Math.sin(latRad) -
        Math.tan(declinationRad) * Math.cos(latRad)
    );

    return {
        elevation: radiansToDegrees(elevation),
        azimuth: normalizeAngle(radiansToDegrees(azimuth)),
    };
}

// Group data by orientation
export function groupByOrientation<T extends { orientacion: number }>(
    data: T[]
): Record<number, T[]> {
    return data.reduce((acc, item) => {
        const orientation = normalizeAngle(item.orientacion);
        if (!acc[orientation]) {
            acc[orientation] = [];
        }
        acc[orientation].push(item);
        return acc;
    }, {} as Record<number, T[]>);
}

export const TransformUtils = {
    normalizeAngle,
    getCardinalDirection,
    formatCoordinates,
    degreesToRadians,
    radiansToDegrees,
    formatDimensions,
    formatArea,
    formatEnergy,
    formatPercentage,
    orientationToAngle,
    sanitizeOrientation,
    timeToHourAngle,
    calculateSolarPosition,
    groupByOrientation,
};

export default TransformUtils;

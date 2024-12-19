interface SunPosition {
    azimuth: number;
    elevation: number;
}

interface LightIntensity {
    direct: number;
    ambient: number;
}

export function calculateSunPosition(date: Date, latitude: number, longitude: number): SunPosition {
    // Convert date to Julian date
    const julianDate = (date.getTime() / 86400000) + 2440587.5;
    const julianCentury = (julianDate - 2451545) / 36525;

    // Calculate geometric mean longitude of the sun
    let L0 = 280.46646 + julianCentury * (36000.76983 + julianCentury * 0.0003032);
    L0 = L0 % 360;
    if (L0 < 0) L0 += 360;

    // Calculate geometric mean anomaly of the sun
    const M = 357.52911 + julianCentury * (35999.05029 - 0.0001537 * julianCentury);

    // Calculate sun's equation of center
    const C = (1.914602 - julianCentury * (0.004817 + 0.000014 * julianCentury)) * Math.sin(M * Math.PI / 180) +
        (0.019993 - 0.000101 * julianCentury) * Math.sin(2 * M * Math.PI / 180) +
        0.000289 * Math.sin(3 * M * Math.PI / 180);

    // Calculate sun's true longitude
    const O = L0 + C;

    // Calculate sun's declination
    const obliquityCorrection = 23.43929111 - julianCentury * (46.815 + julianCentury * (0.00059 - julianCentury * 0.001813)) / 3600;
    const declination = Math.asin(Math.sin(obliquityCorrection * Math.PI / 180) * Math.sin(O * Math.PI / 180)) * 180 / Math.PI;

    // Calculate hour angle
    const hourAngle = (date.getUTCHours() + date.getUTCMinutes() / 60 + date.getUTCSeconds() / 3600 - 12) * 15 +
        longitude;

    // Calculate elevation
    const elevation = Math.asin(
        Math.sin(latitude * Math.PI / 180) * Math.sin(declination * Math.PI / 180) +
        Math.cos(latitude * Math.PI / 180) * Math.cos(declination * Math.PI / 180) * Math.cos(hourAngle * Math.PI / 180)
    ) * 180 / Math.PI;

    // Calculate azimuth
    const azimuth = Math.atan2(
        Math.sin(hourAngle * Math.PI / 180),
        Math.cos(hourAngle * Math.PI / 180) * Math.sin(latitude * Math.PI / 180) -
        Math.tan(declination * Math.PI / 180) * Math.cos(latitude * Math.PI / 180)
    ) * 180 / Math.PI + 180;

    return {
        azimuth,
        elevation,
    };
}

export function calculateLightIntensity(
    sunPosition: SunPosition,
    windowArea: number,
    glassTransmittance: number
): LightIntensity {
    // Base intensity based on sun elevation (0-1)
    let directIntensity = Math.sin(sunPosition.elevation * Math.PI / 180);
    directIntensity = Math.max(0, directIntensity);

    // Scale factor for window area (normalized to typical window size)
    const areaFactor = Math.min(1.5, windowArea / 4); // 4m² as reference size

    // Adjust intensity based on area and transmittance
    directIntensity = directIntensity * areaFactor * glassTransmittance;

    // Scale to reasonable percentage (0-100)
    directIntensity = Math.min(1, directIntensity * 1.5);

    // Ambient light increases with glass transmittance
    const ambientIntensity = 0.2 + (0.3 * glassTransmittance * areaFactor);

    return {
        direct: directIntensity,
        ambient: ambientIntensity,
    };
}

export function calculateTotalIlluminance(
    naturalLight: number,
    artificialLight: number,
    materialTransmittance: number
): number {
    const naturalIlluminance = naturalLight * materialTransmittance * 100000;
    const artificialIlluminance = artificialLight * 500;
    return naturalIlluminance + artificialIlluminance;
}

export function calculateEnergyEfficiency(
    naturalLight: number,
    artificialLight: number,
    windowArea: number,
    targetIlluminance = 500
): number {
    const totalLight = naturalLight + artificialLight;
    if (totalLight === 0) return 0;

    const efficiency = (naturalLight / totalLight) * 100;
    const areaFactor = Math.min(1.5, windowArea / 4);

    return efficiency * areaFactor;
}

export function calculateOptimalArtificialLight(
    naturalLight: number,
    targetIlluminance = 500
): number {
    const requiredArtificial = Math.max(0, targetIlluminance - (naturalLight * 100000));
    return Math.min(1, requiredArtificial / 500);
}

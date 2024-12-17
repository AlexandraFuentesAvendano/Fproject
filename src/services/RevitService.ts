import { BuildingData } from '../context/BuildingContext';

interface EnergyData {
    area: number;
    orientacion: number;
    material: string;
    energia: number;
}

export async function loadRevitData(): Promise<BuildingData> {
    try {
        const response = await fetch('/data/resultados_energia.json');
        if (!response.ok) {
            throw new Error('Error al cargar datos de Revit');
        }

        const energyData: EnergyData[] = await response.json();

        // Process energy data to create building data
        const orientations = energyData.map(item => item.orientacion);
        const uniqueOrientations = [...new Set(orientations)];

        // Calculate total area and energy by orientation
        const orientationStats = uniqueOrientations.reduce((acc, orientation) => {
            const items = energyData.filter(item => item.orientacion === orientation);
            acc[orientation] = {
                totalArea: items.reduce((sum, item) => sum + item.area, 0),
                totalEnergy: items.reduce((sum, item) => sum + item.energia, 0),
                count: items.length,
            };
            return acc;
        }, {} as Record<number, { totalArea: number; totalEnergy: number; count: number }>);

        // Get the primary material (most common)
        const materials = energyData.map(item => item.material);
        const primaryMaterial = materials.reduce((acc, curr) => {
            acc[curr] = (acc[curr] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);
        const mainMaterial = Object.entries(primaryMaterial)
            .sort(([, a], [, b]) => b - a)[0][0];

        // Calculate building dimensions based on total area
        const totalArea = Object.values(orientationStats)
            .reduce((sum, stat) => sum + stat.totalArea, 0);
        const estimatedHeight = 3; // meters per floor
        const estimatedLength = Math.sqrt(totalArea / 2); // Assuming roughly square footprint
        const estimatedWidth = estimatedLength;

        // Create building data
        const buildingData: BuildingData = {
            name: 'Proyecto Revit',
            location: {
                latitude: 40.7128, // Default to NYC, should be provided by Revit
                longitude: -74.0060,
            },
            dimensions: {
                width: estimatedWidth,
                length: estimatedLength,
                height: estimatedHeight,
            },
            orientation: uniqueOrientations[0] || 0, // Use first orientation as primary
            materials: {
                windows: mainMaterial,
                walls: 'concrete', // Default values
                roof: 'concrete',
            },
        };

        return buildingData;

    } catch (error) {
        console.error('Error loading Revit data:', error);
        throw error;
    }
}

export async function saveRevitData(buildingData: BuildingData): Promise<void> {
    try {
        // In a real application, this would send data back to Revit
        // For now, we'll just log it
        console.log('Saving building data:', buildingData);

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Simulate success
        return Promise.resolve();
    } catch (error) {
        console.error('Error saving Revit data:', error);
        throw error;
    }
}

export function calculateEnergyMetrics(energyData: EnergyData[]) {
    // Group data by orientation
    const orientationGroups = energyData.reduce((acc, item) => {
        const key = item.orientacion.toString();
        if (!acc[key]) {
            acc[key] = [];
        }
        acc[key].push(item);
        return acc;
    }, {} as Record<string, EnergyData[]>);

    // Calculate metrics for each orientation
    const metrics = Object.entries(orientationGroups).map(([orientation, items]) => {
        const totalEnergy = items.reduce((sum, item) => sum + item.energia, 0);
        const totalArea = items.reduce((sum, item) => sum + item.area, 0);
        const averageEnergy = totalEnergy / items.length;
        const energyDensity = totalEnergy / totalArea;

        return {
            orientation: parseFloat(orientation),
            totalEnergy,
            totalArea,
            averageEnergy,
            energyDensity,
            count: items.length,
        };
    });

    // Calculate overall metrics
    const overall = {
        totalEnergy: metrics.reduce((sum, m) => sum + m.totalEnergy, 0),
        totalArea: metrics.reduce((sum, m) => sum + m.totalArea, 0),
        averageEnergy: metrics.reduce((sum, m) => sum + m.averageEnergy, 0) / metrics.length,
        orientationCount: metrics.length,
        windowCount: energyData.length,
    };

    return {
        byOrientation: metrics,
        overall,
    };
}

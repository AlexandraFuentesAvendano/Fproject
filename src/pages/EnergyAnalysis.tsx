import { Alert, Box, CircularProgress, Paper, Typography } from '@mui/material';
import { useEffect, useState } from 'react';

interface EnergyData {
    area: number;
    orientacion: number;
    material: string;
    energia: number;
}

function EnergyAnalysis() {
    const [data, setData] = useState<EnergyData[] | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const response = await fetch('/data/resultados_energia.json');
                if (!response.ok) {
                    throw new Error('Error loading energy data');
                }
                const jsonData = await response.json();
                setData(jsonData);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Error desconocido');
                console.error('Error loading energy data:', err);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Alert severity="error" sx={{ mt: 2 }}>
                {error}
            </Alert>
        );
    }

    if (!data) {
        return (
            <Alert severity="info" sx={{ mt: 2 }}>
                No hay datos disponibles
            </Alert>
        );
    }

    // Agrupar datos por orientación
    const groupedData = data.reduce((acc, item) => {
        const key = item.orientacion.toString();
        if (!acc[key]) {
            acc[key] = {
                count: 0,
                totalEnergy: 0,
                totalArea: 0,
            };
        }
        acc[key].count += 1;
        acc[key].totalEnergy += item.energia;
        acc[key].totalArea += item.area;
        return acc;
    }, {} as Record<string, { count: number; totalEnergy: number; totalArea: number }>);

    return (
        <Box sx={{ p: 2 }}>
            <Typography variant="h5" gutterBottom>
                Energy Analysis by Orientation
            </Typography>

            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 2 }}>
                {Object.entries(groupedData).map(([orientation, stats]) => (
                    <Paper key={orientation} sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            Orientation: {orientation}°
                        </Typography>
                        <Typography>
                            Number of elements: {stats.count}
                        </Typography>
                        <Typography>
                            Total energy: {stats.totalEnergy.toFixed(2)} kWh
                        </Typography>
                        <Typography>
                            Total area: {stats.totalArea.toFixed(2)} m²
                        </Typography>
                        <Typography>
                            Average energy: {(stats.totalEnergy / stats.count).toFixed(2)} kWh/elemento
                        </Typography>
                    </Paper>
                ))}
            </Box>
        </Box>
    );
}

export default EnergyAnalysis;

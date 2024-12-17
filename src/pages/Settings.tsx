import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    CardMedia,
    Grid,
    Paper,
    Slider,
    Typography
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useBuildingContext } from '../context/BuildingContext';

interface Material {
    id: string;
    name: string;
    thumbnail: string;
    properties: {
        thermalResistance: number;
        cost: number;
        sustainability: number;
    };
}

const availableMaterials: Material[] = [
    {
        id: 'glass-clear',
        name: 'Vidrio Claro',
        thumbnail: '/materials/glass-clear.jpg',
        properties: {
            thermalResistance: 0.05,
            cost: 100,
            sustainability: 0.7,
        },
    },
    {
        id: 'glass-tinted',
        name: 'Vidrio Tintado',
        thumbnail: '/materials/glass-tinted.jpg',
        properties: {
            thermalResistance: 0.08,
            cost: 150,
            sustainability: 0.8,
        },
    },
    {
        id: 'glass-low-e',
        name: 'Vidrio Bajo Emisivo',
        thumbnail: '/materials/glass-low-e.jpg',
        properties: {
            thermalResistance: 0.12,
            cost: 200,
            sustainability: 0.9,
        },
    },
    {
        id: 'glass-reflective',
        name: 'Vidrio Reflectivo',
        thumbnail: '/materials/glass-reflective.jpg',
        properties: {
            thermalResistance: 0.15,
            cost: 250,
            sustainability: 0.85,
        },
    },
];

function Settings() {
    const { buildingData, updateBuildingSettings } = useBuildingContext();
    const [showSuccess, setShowSuccess] = useState(false);
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);

    const [localSettings, setLocalSettings] = useState({
        materials: {
            windows: 'glass-clear',
        },
        orientation: 0,
    });

    useEffect(() => {
        if (buildingData) {
            setLocalSettings({
                materials: {
                    windows: buildingData.materials.windows,
                },
                orientation: buildingData.orientation,
            });
        }
    }, [buildingData]);

    const handleMaterialChange = (materialId: string) => {
        setLocalSettings((prev) => ({
            ...prev,
            materials: {
                ...prev.materials,
                windows: materialId,
            },
        }));

        const material = availableMaterials.find((m) => m.id === materialId);
        setSelectedMaterial(material || null);
    };

    const handleOrientationChange = (_: Event, value: number | number[]) => {
        setLocalSettings((prev) => ({
            ...prev,
            orientation: value as number,
        }));
    };

    const handleSave = async () => {
        try {
            if (!buildingData) {
                throw new Error('No hay datos del edificio disponibles');
            }

            await updateBuildingSettings({
                ...buildingData,
                materials: {
                    ...buildingData.materials,
                    windows: localSettings.materials.windows,
                },
                orientation: localSettings.orientation,
            });

            setShowSuccess(true);
        } catch (error) {
            setErrorMessage(error instanceof Error ? error.message : 'Error al guardar los cambios');
            setShowError(true);
        }
    };

    if (!buildingData) {
        return (
            <Box sx={{ p: 3 }}>
                <Alert severity="info">
                    No hay datos del edificio disponibles. Por favor, cargue un proyecto desde Revit.
                </Alert>
            </Box>
        );
    }

    return (
        <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
            <Typography variant="h5" gutterBottom>
                Configuración del Proyecto
            </Typography>

            <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                    <Paper sx={{ p: 3, mb: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Material de Ventanas
                        </Typography>
                        <Grid container spacing={2}>
                            {availableMaterials.map((material) => (
                                <Grid item xs={12} sm={6} key={material.id}>
                                    <Card
                                        sx={{
                                            cursor: 'pointer',
                                            border: material.id === localSettings.materials.windows ? 2 : 0,
                                            borderColor: 'primary.main',
                                        }}
                                        onClick={() => handleMaterialChange(material.id)}
                                    >
                                        <CardMedia
                                            component="img"
                                            height="140"
                                            image={material.thumbnail}
                                            alt={material.name}
                                            onError={(e) => {
                                                const target = e.target as HTMLImageElement;
                                                target.src = 'https://via.placeholder.com/140?text=Material';
                                            }}
                                        />
                                        <CardContent>
                                            <Typography variant="h6">{material.name}</Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>

                        <Box sx={{ mt: 4 }}>
                            <Typography variant="h6" gutterBottom>
                                Orientación del Edificio
                            </Typography>
                            <Box sx={{ px: 2 }}>
                                <Slider
                                    value={localSettings.orientation}
                                    onChange={handleOrientationChange}
                                    min={0}
                                    max={359}
                                    valueLabelDisplay="auto"
                                    valueLabelFormat={(value) => `${value}°`}
                                    marks={[
                                        { value: 0, label: 'N' },
                                        { value: 90, label: 'E' },
                                        { value: 180, label: 'S' },
                                        { value: 270, label: 'O' },
                                    ]}
                                />
                            </Box>
                        </Box>
                    </Paper>

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSave}
                            size="large"
                        >
                            Guardar Cambios
                        </Button>
                    </Box>
                </Grid>

                <Grid item xs={12} md={4}>
                    {selectedMaterial && (
                        <Paper sx={{ p: 2 }}>
                            <Typography variant="h6" gutterBottom>
                                Propiedades del Material
                            </Typography>
                            <Box sx={{ mt: 2 }}>
                                <Typography variant="body2" gutterBottom>
                                    Resistencia Térmica: {selectedMaterial.properties.thermalResistance} m²K/W
                                </Typography>
                                <Typography variant="body2" gutterBottom>
                                    Costo Relativo: ${selectedMaterial.properties.cost}/m²
                                </Typography>
                                <Typography variant="body2">
                                    Índice de Sostenibilidad: {(selectedMaterial.properties.sustainability * 100).toFixed(0)}%
                                </Typography>
                            </Box>
                        </Paper>
                    )}

                    {showSuccess && (
                        <Alert
                            severity="success"
                            sx={{ mt: 2 }}
                            onClose={() => setShowSuccess(false)}
                        >
                            Cambios guardados exitosamente
                        </Alert>
                    )}

                    {showError && (
                        <Alert
                            severity="error"
                            sx={{ mt: 2 }}
                            onClose={() => setShowError(false)}
                        >
                            {errorMessage}
                        </Alert>
                    )}
                </Grid>
            </Grid>
        </Box>
    );
}

export default Settings;

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
        name: 'Glass clear',
        thumbnail: '/glass-clear.jpg',
        properties: {
            thermalResistance: 0.05,
            cost: 100,
            sustainability: 0.7,
        },
    },
    {
        id: 'glass-tinted',
        name: 'Glass tinted',
        thumbnail: '/glass-tinted.jpg',
        properties: {
            thermalResistance: 0.08,
            cost: 150,
            sustainability: 0.8,
        },
    },
    {
        id: 'glass-low-e',
        name: 'Glass low-e',
        thumbnail: '/glass-low-e.jpg',
        properties: {
            thermalResistance: 0.12,
            cost: 200,
            sustainability: 0.9,
        },
    },
    {
        id: 'glass-reflective',
        name: 'Glass reflective',
        thumbnail: '/glass-reflective.jpg',
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
                throw new Error('No building data available');
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
                    No building data available. Please upload a project from Revit.
                </Alert>
            </Box>
        );
    }

    return (
        <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
            <Typography variant="h5" gutterBottom>
                Project Configuration
            </Typography>

            <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                    <Paper sx={{ p: 3, mb: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Window Material
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
                                Building Orientation
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
                                        { value: 270, label: 'W' },
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
                            Save Changes
                        </Button>
                    </Box>
                </Grid>

                <Grid item xs={12} md={4}>
                    {selectedMaterial && (
                        <Paper sx={{ p: 2 }}>
                            <Typography variant="h6" gutterBottom>
                                Material Properties
                            </Typography>
                            <Box sx={{ mt: 2 }}>
                                <Typography variant="body2" gutterBottom>
                                    Thermal Resistance: {selectedMaterial.properties.thermalResistance} m²K/W
                                </Typography>
                                <Typography variant="body2" gutterBottom>
                                    Relative Cost: ${selectedMaterial.properties.cost}/m²
                                </Typography>
                                <Typography variant="body2">
                                    Sustainability Index: {(selectedMaterial.properties.sustainability * 100).toFixed(0)}%
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
                            Changes saved successfully
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

import {
    Box,
    Button,
    Card,
    CardContent,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Slider,
    TextField,
    Typography,
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Cartesian3, Math as CesiumMath, Viewer as CesiumViewer, Color, createWorldTerrainAsync, Ion, ShadowMode } from 'cesium';
import { useEffect, useRef, useState } from 'react';
import { CHART_COLORS, DEFAULTS, MATERIALS } from '../constants';
import { useBuildingContext } from '../context/BuildingContext';
import { calculateLightIntensity, calculateSunPosition } from '../utils/lightCalculations';

Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI2NWU2YmU3MS1kNmQ4LTQ3NWEtOGU3NC0wMTgxZjljODJmNTciLCJpZCI6MjYzMTY1LCJpYXQiOjE3MzQ0NjcxNDJ9.mDP2HLSu-4OszHcZtvUiSxl237EP6R8JoPYoSHR9nxg';
window.CESIUM_BASE_URL = '/';

interface LightCalculationResult {
    naturalLight: number;
    artificialLight: number;
}

interface WindowDimensions {
    width: number;
    height: number;
}

interface ViewerRef {
    cesiumElement: CesiumViewer;
}

function LightSimulation() {
    const { buildingData } = useBuildingContext();
    const initialLocation = buildingData?.location || DEFAULTS.LOCATION;

    // Location and Time States
    const [latitude, setLatitude] = useState<number>(initialLocation.latitude);
    const [longitude, setLongitude] = useState<number>(initialLocation.longitude);
    const [date, setDate] = useState<Date>(new Date());

    // Window and Light States
    const [cloudCover, setCloudCover] = useState<number>(0);
    const [selectedMaterial, setSelectedMaterial] = useState<string>(MATERIALS.GLASS_CLEAR.id);
    const [artificialLight, setArtificialLight] = useState<number>(0);
    const [windowDimensions, setWindowDimensions] = useState<WindowDimensions>({
        width: 2,
        height: 1.5
    });

    // Comparison States
    const [beforeResult, setBeforeResult] = useState<LightCalculationResult | null>(null);
    const [afterResult, setAfterResult] = useState<LightCalculationResult | null>(null);
    const [isComparing, setIsComparing] = useState<boolean>(false);

    // Canvas Refs
    const beforeCanvasRef = useRef<HTMLCanvasElement>(null);
    const afterCanvasRef = useRef<HTMLCanvasElement>(null);

    // Map Refs
    const viewerRef = useRef<ViewerRef | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Initialize Cesium viewer
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        let viewer: CesiumViewer;

        const initViewer = async () => {
            const terrainProvider = await createWorldTerrainAsync();

            viewer = new CesiumViewer(container, {
                terrainProvider,
                animation: false,
                baseLayerPicker: false,
                fullscreenButton: false,
                geocoder: false,
                homeButton: false,
                infoBox: true,
                sceneModePicker: false,
                selectionIndicator: false,
                timeline: false,
                navigationHelpButton: false,
                navigationInstructionsInitiallyVisible: false,
            });

            viewer.scene.globe.enableLighting = true;
            viewer.scene.globe.depthTestAgainstTerrain = true;
            viewer.scene.skyBox.show = true;
            viewer.scene.sun.show = true;
            viewer.scene.moon.show = true;
            viewer.scene.skyAtmosphere.show = true;
            viewer.shadows = true;
            viewer.terrainShadows = ShadowMode.ENABLED;

            viewerRef.current = { cesiumElement: viewer };
            updateMapLocation();
        };

        initViewer().catch(console.error);

        return () => {
            if (viewer) {
                viewer.destroy();
            }
        };
    }, []);

    const updateMapLocation = () => {
        if (!viewerRef.current) return;

        const viewer = viewerRef.current.cesiumElement;
        const position = Cartesian3.fromDegrees(longitude, latitude, 0);

        viewer.entities.removeAll();
        viewer.entities.add({
            position,
            point: {
                pixelSize: 15,
                color: Color.RED,
                outlineColor: Color.WHITE,
                outlineWidth: 2,
            }
        });

        viewer.camera.flyTo({
            destination: position,
            orientation: {
                heading: CesiumMath.toRadians(0),
                pitch: CesiumMath.toRadians(-45),
                roll: 0.0,
            },
            duration: 2,
        });
    };

    useEffect(() => {
        if (latitude && longitude) {
            updateMapLocation();
        }
    }, [latitude, longitude]);

    // Calculation function
    const calculateLighting = () => {
        const material = Object.values(MATERIALS).find(m => m.id === selectedMaterial);
        if (!material) return;

        const sunPos = calculateSunPosition(date, latitude, longitude);
        const windowArea = windowDimensions.width * windowDimensions.height;
        const { direct } = calculateLightIntensity(sunPos, windowArea, material.transmittance);

        const naturalLightPercentage = direct * 100;
        const artificialLightPercentage = artificialLight * 100;

        const result = {
            naturalLight: naturalLightPercentage,
            artificialLight: artificialLightPercentage,
        };

        if (isComparing) {
            if (!beforeResult) {
                setBeforeResult(result);
                drawPieChart(beforeCanvasRef.current, result, 'Before');
            } else {
                setAfterResult(result);
                drawPieChart(afterCanvasRef.current, result, 'After');
            }
        } else {
            setBeforeResult(result);
            setAfterResult(null);
            drawPieChart(beforeCanvasRef.current, result, 'Current');
        }
    };

    const drawPieChart = (canvas: HTMLCanvasElement | null, result: LightCalculationResult, label: string) => {
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const total = result.naturalLight + result.artificialLight;
        const naturalAngle = (result.naturalLight / total) * Math.PI * 2;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        canvas.width = 300;
        canvas.height = 300;

        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = Math.min(centerX, centerY) * 0.7;

        // Title
        ctx.font = 'bold 16px Arial';
        ctx.fillStyle = '#000';
        ctx.textAlign = 'center';
        ctx.fillText(label, centerX, 30);

        // Natural Light
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, 0, naturalAngle);
        ctx.fillStyle = CHART_COLORS.NATURAL_LIGHT;
        ctx.fill();

        // Artificial Light
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, naturalAngle, Math.PI * 2);
        ctx.fillStyle = CHART_COLORS.ARTIFICIAL_LIGHT;
        ctx.fill();

        // Labels
        ctx.font = '14px Arial';
        ctx.fillStyle = '#000';
        ctx.textAlign = 'center';

        // Natural Light Label
        const naturalMidAngle = naturalAngle / 2;
        const naturalX = centerX + Math.cos(naturalMidAngle) * (radius * 0.6);
        const naturalY = centerY + Math.sin(naturalMidAngle) * (radius * 0.6);
        ctx.fillText(`Natural: ${result.naturalLight.toFixed(1)}%`, naturalX, naturalY);

        // Artificial Light Label
        const artificialMidAngle = naturalAngle + (Math.PI * 2 - naturalAngle) / 2;
        const artificialX = centerX + Math.cos(artificialMidAngle) * (radius * 0.6);
        const artificialY = centerY + Math.sin(artificialMidAngle) * (radius * 0.6);
        ctx.fillText(`Artificial: ${result.artificialLight.toFixed(1)}%`, artificialX, artificialY);
    };

    const startComparison = () => {
        setIsComparing(true);
        setAfterResult(null);
    };

    const resetComparison = () => {
        setIsComparing(false);
        setBeforeResult(null);
        setAfterResult(null);
    };

    return (
        <Box sx={{ height: 'calc(100vh - 100px)', display: 'flex', flexDirection: 'column', gap: 2, overflow: 'auto' }}>
            {/* Map Section - Now Full Width and Taller */}
            <Paper sx={{ p: 2, minHeight: '800px', position: 'relative' }}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Typography variant="h6" gutterBottom>
                            Location Selection
                        </Typography>
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <TextField
                            fullWidth
                            label="Latitude"
                            type="number"
                            value={latitude}
                            onChange={(e) => {
                                const value = parseFloat(e.target.value);
                                if (!isNaN(value) && value >= -90 && value <= 90) {
                                    setLatitude(value);
                                }
                            }}
                            helperText="Valid range: -90° to 90°"
                        />
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <TextField
                            fullWidth
                            label="Longitude"
                            type="number"
                            value={longitude}
                            onChange={(e) => {
                                const value = parseFloat(e.target.value);
                                if (!isNaN(value) && value >= -180 && value <= 180) {
                                    setLongitude(value);
                                }
                            }}
                            helperText="Valid range: -180° to 180°"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <div
                            ref={containerRef}
                            style={{
                                width: '100%',
                                height: '600px', // Much taller map
                                position: 'relative',
                                border: '1px solid #ccc',
                                overflow: 'hidden',
                                borderRadius: '4px',
                            }}
                        />
                    </Grid>
                </Grid>
            </Paper>

            {/* Controls Section */}
            <Paper sx={{ p: 2 }}>
                <Typography variant="h5" gutterBottom>
                    Light Distribution Simulation
                </Typography>

                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DateTimePicker
                                label="Date and Time"
                                value={date}
                                onChange={(newValue) => newValue && setDate(newValue)}
                                sx={{ width: '100%' }}
                            />
                        </LocalizationProvider>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <FormControl fullWidth>
                            <InputLabel>Window Material</InputLabel>
                            <Select
                                value={selectedMaterial}
                                label="Window Material"
                                onChange={(e) => setSelectedMaterial(e.target.value)}
                            >
                                {Object.values(MATERIALS).map((material) => (
                                    <MenuItem key={material.id} value={material.id}>
                                        {material.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Typography gutterBottom>Cloud Cover</Typography>
                        <Slider
                            value={cloudCover}
                            onChange={(_, value) => setCloudCover(value as number)}
                            min={0}
                            max={1}
                            step={0.1}
                            valueLabelDisplay="auto"
                            valueLabelFormat={(value) => `${Math.round(value * 100)}%`}
                            marks={[
                                { value: 0, label: 'Clear' },
                                { value: 1, label: 'Cloudy' },
                            ]}
                        />
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Typography gutterBottom>Artificial Light</Typography>
                        <Slider
                            value={artificialLight}
                            onChange={(_, value) => setArtificialLight(value as number)}
                            min={0}
                            max={1}
                            step={0.1}
                            valueLabelDisplay="auto"
                            valueLabelFormat={(value) => `${Math.round(value * 100)}%`}
                        />
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Typography gutterBottom>Window Dimensions</Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <Typography variant="caption">Width: {windowDimensions.width}m</Typography>
                                <Slider
                                    value={windowDimensions.width}
                                    onChange={(_, value) => setWindowDimensions({
                                        ...windowDimensions,
                                        width: value as number
                                    })}
                                    min={0.5}
                                    max={5}
                                    step={0.1}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant="caption">Height: {windowDimensions.height}m</Typography>
                                <Slider
                                    value={windowDimensions.height}
                                    onChange={(_, value) => setWindowDimensions({
                                        ...windowDimensions,
                                        height: value as number
                                    })}
                                    min={0.5}
                                    max={5}
                                    step={0.1}
                                />
                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid item xs={12}>
                        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                            <Button
                                variant="contained"
                                color="primary"
                                size="large"
                                onClick={calculateLighting}
                            >
                                Calculate Light Distribution
                            </Button>
                            {!isComparing ? (
                                <Button
                                    variant="outlined"
                                    color="primary"
                                    size="large"
                                    onClick={startComparison}
                                    disabled={!beforeResult}
                                >
                                    Start Comparison
                                </Button>
                            ) : (
                                <Button
                                    variant="outlined"
                                    color="secondary"
                                    size="large"
                                    onClick={resetComparison}
                                >
                                    Reset Comparison
                                </Button>
                            )}
                        </Box>
                    </Grid>
                </Grid>
            </Paper>

            {/* Results Section */}
            <Grid container spacing={2}>
                {/* Window Visualization */}
                <Grid item xs={12} md={6}>
                    <Paper
                        sx={{
                            height: '400px',
                            overflow: 'hidden',
                            position: 'relative',
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            backgroundColor: "#f5f5f5"
                        }}
                    >
                        <Box
                            sx={{
                                height: windowDimensions.height * 100,
                                width: windowDimensions.width * 100,
                                backgroundColor: selectedMaterial === MATERIALS.GLASS_CLEAR.id ? "rgba(200, 230, 255, 0.6)" :
                                    selectedMaterial === MATERIALS.GLASS_TINTED.id ? "rgba(130, 160, 190, 0.6)" :
                                        selectedMaterial === MATERIALS.GLASS_LOW_E.id ? "rgba(170, 200, 225, 0.6)" :
                                            "rgba(100, 130, 160, 0.6)",
                                border: "2px solid #666",
                                boxShadow: "0 0 10px rgba(0,0,0,0.1)",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center"
                            }}
                        >
                            <Typography variant="caption" color="textSecondary">
                                {windowDimensions.width}m × {windowDimensions.height}m
                            </Typography>
                        </Box>
                    </Paper>
                </Grid>

                {/* Charts */}
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 2, height: '400px' }}>
                        <Typography variant="h6" gutterBottom align="center">
                            Light Distribution {isComparing ? 'Comparison' : ''}
                        </Typography>

                        <Grid container spacing={2}>
                            <Grid item xs={isComparing ? 6 : 12}>
                                <Box sx={{ height: 300, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    <canvas ref={beforeCanvasRef} />
                                </Box>
                            </Grid>

                            {isComparing && (
                                <Grid item xs={6}>
                                    <Box sx={{ height: 300, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                        <canvas ref={afterCanvasRef} />
                                    </Box>
                                </Grid>
                            )}
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>

            {/* Additional Information */}
            <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Natural Light
                            </Typography>
                            <Typography variant="body2">
                                Intensity: {Math.round((1 - cloudCover) * 100)}%
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Artificial Light
                            </Typography>
                            <Typography variant="body2">
                                Intensity: {Math.round(artificialLight * 100)}%
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Current Material
                            </Typography>
                            <Typography variant="body2">
                                Transmittance: {
                                    Object.values(MATERIALS).find(m => m.id === selectedMaterial)?.transmittance.toFixed(2)
                                }
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}

export default LightSimulation;

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
    Typography,
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useEffect, useRef, useState } from 'react';
import { CHART_COLORS, MATERIALS } from '../constants';
import { calculateLightIntensity, calculateSunPosition } from '../utils/lightCalculations';

interface LightCalculationResult {
    naturalLight: number;
    artificialLight: number;
}

function LightSimulation() {
    const [date, setDate] = useState<Date>(new Date());
    const [cloudCover, setCloudCover] = useState<number>(0);
    const [selectedMaterial, setSelectedMaterial] = useState<string>(MATERIALS.GLASS_CLEAR.id);
    const [artificialLight, setArtificialLight] = useState<number>(0);
    const [calculationResult, setCalculationResult] = useState<LightCalculationResult | null>(null);
    const mountRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const calculateLighting = () => {
        const material = Object.values(MATERIALS).find(m => m.id === selectedMaterial);
        if (!material) return;

        const sunPos = calculateSunPosition(date, 40.7128, -74.0060);
        const { direct } = calculateLightIntensity(sunPos, cloudCover);

        const naturalLightPercentage = direct * material.transmittance * (1 - cloudCover) * 100;
        const artificialLightPercentage = artificialLight * 100;

        setCalculationResult({
            naturalLight: naturalLightPercentage,
            artificialLight: artificialLightPercentage,
        });

        // Draw pie chart
        drawPieChart();
    };

    const drawPieChart = () => {
        if (!calculationResult || !canvasRef.current) return;

        const ctx = canvasRef.current.getContext('2d');
        if (!ctx) return;

        const total = calculationResult.naturalLight + calculationResult.artificialLight;
        const naturalAngle = (calculationResult.naturalLight / total) * Math.PI * 2;

        // Clear canvas
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        // Set canvas size
        ctx.canvas.width = 300;
        ctx.canvas.height = 300;

        const centerX = ctx.canvas.width / 2;
        const centerY = ctx.canvas.height / 2;
        const radius = Math.min(centerX, centerY) * 0.8;

        // Draw natural light slice
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, 0, naturalAngle);
        ctx.fillStyle = CHART_COLORS.NATURAL_LIGHT;
        ctx.fill();

        // Draw artificial light slice
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, naturalAngle, Math.PI * 2);
        ctx.fillStyle = CHART_COLORS.ARTIFICIAL_LIGHT;
        ctx.fill();

        // Draw labels
        ctx.font = '14px Arial';
        ctx.fillStyle = '#000';
        ctx.textAlign = 'center';

        // Natural light label
        const naturalMidAngle = naturalAngle / 2;
        const naturalX = centerX + Math.cos(naturalMidAngle) * (radius * 0.7);
        const naturalY = centerY + Math.sin(naturalMidAngle) * (radius * 0.7);
        ctx.fillText(`${calculationResult.naturalLight.toFixed(1)}%`, naturalX, naturalY);

        // Artificial light label
        const artificialMidAngle = naturalAngle + (Math.PI * 2 - naturalAngle) / 2;
        const artificialX = centerX + Math.cos(artificialMidAngle) * (radius * 0.7);
        const artificialY = centerY + Math.sin(artificialMidAngle) * (radius * 0.7);
        ctx.fillText(`${calculationResult.artificialLight.toFixed(1)}%`, artificialX, artificialY);
    };

    useEffect(() => {
        if (calculationResult) {
            drawPieChart();
        }
    }, [calculationResult]);

    return (
        <Box sx={{ height: 'calc(100vh - 100px)', display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Paper sx={{ p: 2 }}>
                <Typography variant="h5" gutterBottom>
                    Simulación de Luz Natural y Artificial
                </Typography>

                <Grid container spacing={3}>
                    <Grid item xs={12} md={3}>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DateTimePicker
                                label="Fecha y Hora"
                                value={date}
                                onChange={(newValue) => newValue && setDate(newValue)}
                                sx={{ width: '100%' }}
                            />
                        </LocalizationProvider>
                    </Grid>

                    <Grid item xs={12} md={3}>
                        <Typography gutterBottom>Nubosidad</Typography>
                        <Slider
                            value={cloudCover}
                            onChange={(_, value) => setCloudCover(value as number)}
                            min={0}
                            max={1}
                            step={0.1}
                            valueLabelDisplay="auto"
                            valueLabelFormat={(value) => `${Math.round(value * 100)}%`}
                            marks={[
                                { value: 0, label: 'Despejado' },
                                { value: 1, label: 'Nublado' },
                            ]}
                        />
                    </Grid>

                    <Grid item xs={12} md={3}>
                        <Typography gutterBottom>Luz Artificial</Typography>
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

                    <Grid item xs={12} md={3}>
                        <FormControl fullWidth>
                            <InputLabel>Material de Ventanas</InputLabel>
                            <Select
                                value={selectedMaterial}
                                label="Material de Ventanas"
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

                    <Grid item xs={12}>
                        <Button
                            variant="contained"
                            color="primary"
                            size="large"
                            onClick={calculateLighting}
                            sx={{ mt: 2 }}
                        >
                            Calcular Distribución de Luz
                        </Button>
                    </Grid>
                </Grid>
            </Paper>

            <Grid container spacing={2}>
                <Grid item xs={12} md={8}>
                    <Paper
                        ref={mountRef}
                        sx={{
                            height: '400px',
                            overflow: 'hidden',
                            position: 'relative',
                            '& canvas': {
                                outline: 'none',
                            },
                        }}
                    />
                </Grid>

                <Grid item xs={12} md={4}>
                    {calculationResult && (
                        <Paper sx={{ p: 2, height: '400px' }}>
                            <Typography variant="h6" gutterBottom align="center">
                                Distribución de Iluminación
                            </Typography>
                            <Box sx={{ height: 300, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <canvas ref={canvasRef} />
                            </Box>
                            <Typography variant="body2" align="center" sx={{ mt: 2 }}>
                                Luz Natural: {calculationResult.naturalLight.toFixed(1)}%
                                <br />
                                Luz Artificial: {calculationResult.artificialLight.toFixed(1)}%
                            </Typography>
                        </Paper>
                    )}
                </Grid>
            </Grid>

            <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Luz Natural
                            </Typography>
                            <Typography variant="body2">
                                Intensidad: {Math.round((1 - cloudCover) * 100)}%
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Luz Artificial
                            </Typography>
                            <Typography variant="body2">
                                Intensidad: {Math.round(artificialLight * 100)}%
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Material Actual
                            </Typography>
                            <Typography variant="body2">
                                Transmitancia: {
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

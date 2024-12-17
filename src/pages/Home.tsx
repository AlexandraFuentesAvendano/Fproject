import AssessmentIcon from '@mui/icons-material/Assessment';
import MapIcon from '@mui/icons-material/Map';
import SettingsIcon from '@mui/icons-material/Settings';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import {
    Box,
    Button,
    Card,
    CardContent,
    Grid,
    Typography
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const features = [
    {
        title: 'Ubicación 3D',
        description: 'Visualiza la ubicación del proyecto en un mapa 3D interactivo',
        icon: <MapIcon sx={{ fontSize: 40 }} />,
        path: '/map',
        color: '#4CAF50',
    },
    {
        title: 'Simulación de Luz',
        description: 'Analiza la entrada de luz natural y artificial en el edificio',
        icon: <WbSunnyIcon sx={{ fontSize: 40 }} />,
        path: '/light-simulation',
        color: '#FFC107',
    },
    {
        title: 'Análisis de Energía',
        description: 'Visualiza el consumo de energía por orientación y materiales',
        icon: <AssessmentIcon sx={{ fontSize: 40 }} />,
        path: '/energy-analysis',
        color: '#2196F3',
    },
    {
        title: 'Configuración',
        description: 'Personaliza materiales y ajusta parámetros del proyecto',
        icon: <SettingsIcon sx={{ fontSize: 40 }} />,
        path: '/settings',
        color: '#9C27B0',
    },
];

function Home() {
    const navigate = useNavigate();

    return (
        <Box sx={{ flexGrow: 1, p: 3 }}>
            <Typography variant="h4" gutterBottom align="center" sx={{ mb: 4 }}>
                Visualizador de Proyectos Revit
            </Typography>

            <Typography variant="subtitle1" gutterBottom align="center" sx={{ mb: 6 }}>
                Analiza y optimiza tus proyectos con herramientas de visualización avanzadas
            </Typography>

            <Grid container spacing={4}>
                {features.map((feature) => (
                    <Grid item xs={12} sm={6} md={3} key={feature.title}>
                        <Card
                            sx={{
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                transition: 'transform 0.2s',
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                },
                            }}
                        >
                            <Box
                                sx={{
                                    p: 2,
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    bgcolor: feature.color,
                                    color: 'white',
                                }}
                            >
                                {feature.icon}
                            </Box>
                            <CardContent sx={{ flexGrow: 1 }}>
                                <Typography gutterBottom variant="h6" component="h2">
                                    {feature.title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                    {feature.description}
                                </Typography>
                                <Button
                                    variant="contained"
                                    fullWidth
                                    onClick={() => navigate(feature.path)}
                                    sx={{
                                        bgcolor: feature.color,
                                        '&:hover': {
                                            bgcolor: feature.color,
                                            filter: 'brightness(0.9)',
                                        },
                                    }}
                                >
                                    Explorar
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Box sx={{ mt: 6, textAlign: 'center' }}>
                <Typography variant="body1" color="text.secondary">
                    Proyecto integrado con Revit y Dynamo para análisis energético y optimización de diseño
                </Typography>
            </Box>
        </Box>
    );
}

export default Home;

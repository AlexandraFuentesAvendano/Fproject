import AssessmentIcon from '@mui/icons-material/Assessment';
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
        title: 'Light Simulation',
        description: 'Analyzes the entry of natural and artificial light into the building',
        icon: <WbSunnyIcon sx={{ fontSize: 40 }} />,
        path: '/light-simulation',
        color: '#FFC107',
    },
    {
        title: 'Energy Analysis',
        description: 'View energy consumption by orientation and materials',
        icon: <AssessmentIcon sx={{ fontSize: 40 }} />,
        path: '/energy-analysis',
        color: '#2196F3',
    },
    {
        title: 'Configuration',
        description: 'Customize materials and adjust project parameters',
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
                Revit Project Viewer
            </Typography>

            <Typography variant="subtitle1" gutterBottom align="center" sx={{ mb: 6 }}>
                Analyze and optimize your projects with advanced visualization tools
            </Typography>

            <Grid container spacing={4} justifyContent="center" alignItems="center">
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
                                    Explore
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Box sx={{ mt: 6, textAlign: 'center' }}>
                <Typography variant="body1" color="text.secondary">
                    Project integrated with Revit and Dynamo for energy analysis and design optimization
                </Typography>
            </Box>
        </Box>
    );
}

export default Home;

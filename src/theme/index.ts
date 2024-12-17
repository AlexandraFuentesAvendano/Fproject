import { ThemeOptions, createTheme as createMuiTheme } from '@mui/material';
import { ThemeConfig } from '../types';

const themeConfig: ThemeConfig = {
    colors: {
        primary: '#1976d2',
        secondary: '#dc004e',
        success: '#4caf50',
        error: '#f44336',
        warning: '#ff9800',
        info: '#2196f3',
        background: '#f5f5f5',
        surface: '#ffffff',
        text: '#333333',
    },
    spacing: 8,
    borderRadius: 4,
    transitions: {
        duration: 300,
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
    },
    breakpoints: {
        xs: 0,
        sm: 600,
        md: 960,
        lg: 1280,
        xl: 1920,
    },
};

const themeOptions: ThemeOptions = {
    palette: {
        primary: {
            main: themeConfig.colors.primary,
            contrastText: '#ffffff',
        },
        secondary: {
            main: themeConfig.colors.secondary,
            contrastText: '#ffffff',
        },
        error: {
            main: themeConfig.colors.error,
        },
        warning: {
            main: themeConfig.colors.warning,
        },
        info: {
            main: themeConfig.colors.info,
        },
        success: {
            main: themeConfig.colors.success,
        },
        background: {
            default: themeConfig.colors.background,
            paper: themeConfig.colors.surface,
        },
        text: {
            primary: themeConfig.colors.text,
        },
    },
    typography: {
        fontFamily: [
            'Roboto',
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Arial',
            'sans-serif',
        ].join(','),
        h1: {
            fontSize: '2.5rem',
            fontWeight: 500,
        },
        h2: {
            fontSize: '2rem',
            fontWeight: 500,
        },
        h3: {
            fontSize: '1.75rem',
            fontWeight: 500,
        },
        h4: {
            fontSize: '1.5rem',
            fontWeight: 500,
        },
        h5: {
            fontSize: '1.25rem',
            fontWeight: 500,
        },
        h6: {
            fontSize: '1rem',
            fontWeight: 500,
        },
    },
    shape: {
        borderRadius: themeConfig.borderRadius,
    },
    transitions: {
        duration: {
            shortest: themeConfig.transitions.duration * 0.5,
            shorter: themeConfig.transitions.duration * 0.75,
            short: themeConfig.transitions.duration,
            standard: themeConfig.transitions.duration,
            complex: themeConfig.transitions.duration * 1.25,
            enteringScreen: themeConfig.transitions.duration * 0.75,
            leavingScreen: themeConfig.transitions.duration * 0.5,
        },
        easing: {
            easeInOut: themeConfig.transitions.easing,
        },
    },
    breakpoints: {
        values: themeConfig.breakpoints,
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    borderRadius: themeConfig.borderRadius,
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    borderRadius: themeConfig.borderRadius,
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: themeConfig.borderRadius,
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                },
            },
        },
        MuiDrawer: {
            styleOverrides: {
                paper: {
                    border: 'none',
                    boxShadow: '2px 0 8px rgba(0, 0, 0, 0.1)',
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        borderRadius: themeConfig.borderRadius,
                    },
                },
            },
        },
        MuiTooltip: {
            styleOverrides: {
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    borderRadius: themeConfig.borderRadius / 2,
                    fontSize: '0.75rem',
                },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    borderRadius: themeConfig.borderRadius * 2,
                },
            },
        },
    },
};

const theme = createMuiTheme(themeOptions);

export { theme, themeConfig };
export default theme;

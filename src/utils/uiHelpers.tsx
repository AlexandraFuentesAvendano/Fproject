import ErrorIcon from '@mui/icons-material/Error';
import InfoIcon from '@mui/icons-material/Info';
import {
    Alert,
    AlertTitle,
    Box,
    CircularProgress,
    IconButton,
    Paper,
    Tooltip,
    Typography,
} from '@mui/material';
import React from 'react';

interface LoadingProps {
    message?: string;
}

export function Loading({ message = 'Cargando...' }: LoadingProps) {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                p: 3,
                gap: 2,
            }}
        >
            <CircularProgress />
            <Typography variant="body1" color="text.secondary">
                {message}
            </Typography>
        </Box>
    );
}

interface ErrorMessageProps {
    message: string;
    details?: {
        code?: string;
        context?: Record<string, any>;
        timestamp: string;
    };
    onRetry?: () => void;
}

export function ErrorMessage({ message, details, onRetry }: ErrorMessageProps) {
    return (
        <Alert
            severity="error"
            action={
                onRetry && (
                    <IconButton
                        color="inherit"
                        size="small"
                        onClick={onRetry}
                    >
                        Reintentar
                    </IconButton>
                )
            }
        >
            <AlertTitle>Error</AlertTitle>
            {message}
            {details && (
                <Box sx={{ mt: 1, fontSize: '0.875rem' }}>
                    <Typography variant="caption" display="block">
                        Código: {details.code}
                    </Typography>
                    {details.context && (
                        <Typography variant="caption" display="block">
                            Contexto: {JSON.stringify(details.context)}
                        </Typography>
                    )}
                </Box>
            )}
        </Alert>
    );
}

interface InfoCardProps {
    title: string;
    value: string | number;
    unit?: string;
    tooltip?: string;
}

export function InfoCard({ title, value, unit, tooltip }: InfoCardProps) {
    const content = (
        <Paper sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Typography variant="subtitle2" color="text.secondary">
                    {title}
                </Typography>
                {tooltip && (
                    <Tooltip title={tooltip}>
                        <IconButton size="small" sx={{ ml: 1 }}>
                            <InfoIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                )}
            </Box>
            <Typography variant="h6" component="div">
                {value}
                {unit && (
                    <Typography
                        component="span"
                        variant="body2"
                        color="text.secondary"
                        sx={{ ml: 0.5 }}
                    >
                        {unit}
                    </Typography>
                )}
            </Typography>
        </Paper>
    );

    return content;
}

interface NoDataMessageProps {
    message?: string;
    icon?: React.ReactNode;
}

export function NoDataMessage({
    message = 'No hay datos disponibles',
    icon,
}: NoDataMessageProps) {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                p: 4,
                gap: 2,
            }}
        >
            {icon || <ErrorIcon color="action" sx={{ fontSize: 48 }} />}
            <Typography variant="body1" color="text.secondary">
                {message}
            </Typography>
        </Box>
    );
}

interface DataCardProps {
    title: string;
    children: React.ReactNode;
    action?: React.ReactNode;
}

export function DataCard({ title, children, action }: DataCardProps) {
    return (
        <Paper sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    {title}
                </Typography>
                {action}
            </Box>
            {children}
        </Paper>
    );
}

interface MetricDisplayProps {
    label: string;
    value: number;
    unit: string;
    change?: number;
    tooltip?: string;
}

export function MetricDisplay({
    label,
    value,
    unit,
    change,
    tooltip,
}: MetricDisplayProps) {
    return (
        <Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                    {label}
                </Typography>
                {tooltip && (
                    <Tooltip title={tooltip}>
                        <IconButton size="small" sx={{ ml: 0.5 }}>
                            <InfoIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                )}
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'baseline', mt: 0.5 }}>
                <Typography variant="h6" component="span">
                    {typeof value === 'number' ? value.toFixed(2) : value}
                </Typography>
                <Typography
                    variant="body2"
                    color="text.secondary"
                    component="span"
                    sx={{ ml: 0.5 }}
                >
                    {unit}
                </Typography>
                {change !== undefined && (
                    <Typography
                        variant="body2"
                        component="span"
                        sx={{
                            ml: 1,
                            color: change >= 0 ? 'success.main' : 'error.main',
                        }}
                    >
                        {change >= 0 ? '+' : ''}
                        {change.toFixed(1)}%
                    </Typography>
                )}
            </Box>
        </Box>
    );
}

export const UIHelpers = {
    Loading,
    ErrorMessage,
    InfoCard,
    NoDataMessage,
    DataCard,
    MetricDisplay,
};

export default UIHelpers;

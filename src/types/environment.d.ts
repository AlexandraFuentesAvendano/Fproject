/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_API_BASE_URL: string;
    readonly VITE_CESIUM_ACCESS_TOKEN: string;
    readonly VITE_ENVIRONMENT: 'development' | 'production' | 'test';
    readonly VITE_BUILD_VERSION: string;
    readonly VITE_BUILD_TIME: string;
    readonly VITE_COMMIT_HASH: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}

declare module '*.svg' {
    import React = require('react');
    export const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
    const src: string;
    export default src;
}

declare module '*.jpg' {
    const content: string;
    export default content;
}

declare module '*.png' {
    const content: string;
    export default content;
}

declare module '*.json' {
    const content: any;
    export default content;
}

declare module 'cesium' {
    export * from 'cesium';
}

declare module 'resium' {
    export * from 'resium';
}

declare module '@mui/material/styles' {
    interface Theme {
        status: {
            danger: string;
        };
    }
    interface ThemeOptions {
        status?: {
            danger?: string;
        };
    }
    interface Palette {
        neutral?: Palette['primary'];
    }
    interface PaletteOptions {
        neutral?: PaletteOptions['primary'];
    }
}

declare module '@mui/material/styles/createPalette' {
    interface TypeBackground {
        light?: string;
    }
}

declare module '@mui/material/Button' {
    interface ButtonPropsColorOverrides {
        neutral: true;
    }
}

declare module 'chart.js' {
    interface ChartTypeRegistry {
        derivedBubble: ChartTypeRegistry['bubble'];
    }
}

declare module 'react-chartjs-2' {
    export interface ChartProps extends ChartComponentProps {
        redraw?: boolean;
    }
}

declare namespace NodeJS {
    interface ProcessEnv {
        NODE_ENV: 'development' | 'production' | 'test';
        VITE_API_BASE_URL: string;
        VITE_CESIUM_ACCESS_TOKEN: string;
        VITE_ENVIRONMENT: 'development' | 'production' | 'test';
        VITE_BUILD_VERSION: string;
        VITE_BUILD_TIME: string;
        VITE_COMMIT_HASH: string;
    }
}

declare global {
    interface Window {
        Cesium: typeof import('cesium');
    }
}

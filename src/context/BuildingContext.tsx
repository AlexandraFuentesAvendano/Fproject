import React, { createContext, useCallback, useContext, useState } from 'react';

interface Dimensions {
    width: number;
    length: number;
    height: number;
}

interface Location {
    latitude: number;
    longitude: number;
}

interface Materials {
    windows: string;
    walls?: string;
    roof?: string;
}

export interface BuildingData {
    name: string;
    location: Location;
    dimensions: Dimensions;
    orientation: number;
    materials: Materials;
}

interface BuildingContextType {
    buildingData: BuildingData | null;
    updateBuildingSettings: (newData: BuildingData) => void;
    setInitialData: (data: BuildingData) => void;
}

const defaultBuildingData: BuildingData = {
    name: 'Proyecto de Ejemplo',
    location: {
        latitude: 40.7128,
        longitude: -74.0060,
    },
    dimensions: {
        width: 10,
        length: 15,
        height: 6,
    },
    orientation: 0,
    materials: {
        windows: 'glass-clear',
        walls: 'concrete',
        roof: 'concrete',
    },
};

const BuildingContext = createContext<BuildingContextType | undefined>(undefined);

export function BuildingProvider({ children }: { children: React.ReactNode }) {
    const [buildingData, setBuildingData] = useState<BuildingData | null>(defaultBuildingData);

    const setInitialData = useCallback((data: BuildingData) => {
        setBuildingData(data);
    }, []);

    const updateBuildingSettings = useCallback((newData: BuildingData) => {
        setBuildingData(newData);
    }, []);

    return (
        <BuildingContext.Provider
            value={{
                buildingData,
                updateBuildingSettings,
                setInitialData,
            }}
        >
            {children}
        </BuildingContext.Provider>
    );
}

export function useBuildingContext() {
    const context = useContext(BuildingContext);
    if (context === undefined) {
        throw new Error('useBuildingContext must be used within a BuildingProvider');
    }
    return context;
}

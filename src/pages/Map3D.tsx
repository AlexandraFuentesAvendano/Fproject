import { Alert, Box, Paper, Typography } from '@mui/material';
import { Cartesian3, Math as CesiumMath, Viewer as CesiumViewer, Color, createWorldTerrainAsync, Ion, Rectangle, ShadowMode } from 'cesium';
import { useEffect, useRef } from 'react';
import { DEFAULTS } from '../constants';
import { useBuildingContext } from '../context/BuildingContext';

// Initialize Cesium with the access token
Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI0MzAyNzUyNy1mNmRiLTQyNTQtOWQ3Mi0wYjI3MmVkNmRkOGQiLCJpZCI6MTc5NDY2LCJpYXQiOjE3MDI1MTQxMzF9.YVacpRW5JvO5YE-8hxE8kUteE6rEF9DXwzlN2DHWiFw';

interface ViewerRef {
    cesiumElement: CesiumViewer;
}

function Map3D() {
    const { buildingData } = useBuildingContext();
    const viewerRef = useRef<ViewerRef | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const location = buildingData?.location || DEFAULTS.LOCATION;

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        let viewer: CesiumViewer;

        const initViewer = async () => {
            // Create terrain provider
            const terrainProvider = await createWorldTerrainAsync();

            // Create Cesium viewer
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

            // Configure viewer
            viewer.scene.globe.enableLighting = true;
            viewer.scene.globe.depthTestAgainstTerrain = true;
            viewer.scene.skyBox.show = true;
            viewer.scene.sun.show = true;
            viewer.scene.moon.show = true;
            viewer.scene.skyAtmosphere.show = true;
            viewer.shadows = true;
            viewer.terrainShadows = ShadowMode.ENABLED;

            // Add building entity
            const buildingPosition = Cartesian3.fromDegrees(
                location.longitude,
                location.latitude,
                0
            );

            // Add marker
            viewer.entities.add({
                name: buildingData?.name || 'Proyecto',
                position: buildingPosition,
                point: {
                    pixelSize: 15,
                    color: Color.RED,
                    outlineColor: Color.WHITE,
                    outlineWidth: 2,
                },
                description: `
          <table style="width: 100%">
            <tr>
              <th>Nombre:</th>
              <td>${buildingData?.name || 'Proyecto'}</td>
            </tr>
            <tr>
              <th>Latitud:</th>
              <td>${location.latitude.toFixed(6)}°</td>
            </tr>
            <tr>
              <th>Longitud:</th>
              <td>${location.longitude.toFixed(6)}°</td>
            </tr>
            ${buildingData ? `
              <tr>
                <th>Dimensiones:</th>
                <td>
                  Ancho: ${buildingData.dimensions.width}m<br>
                  Largo: ${buildingData.dimensions.length}m<br>
                  Alto: ${buildingData.dimensions.height}m
                </td>
              </tr>
              <tr>
                <th>Orientación:</th>
                <td>${buildingData.orientation}°</td>
              </tr>
            ` : ''}
          </table>
        `,
            });

            // Add building footprint if data available
            if (buildingData) {
                viewer.entities.add({
                    position: buildingPosition,
                    rectangle: {
                        coordinates: Rectangle.fromDegrees(
                            location.longitude - 0.0001,
                            location.latitude - 0.0001,
                            location.longitude + 0.0001,
                            location.latitude + 0.0001
                        ),
                        material: Color.RED.withAlpha(0.3),
                        outline: true,
                        outlineColor: Color.RED,
                        height: 0,
                        extrudedHeight: buildingData.dimensions.height,
                    },
                });
            }

            // Set initial camera position
            viewer.camera.flyTo({
                destination: Cartesian3.fromDegrees(
                    location.longitude,
                    location.latitude,
                    1000
                ),
                orientation: {
                    heading: CesiumMath.toRadians(0),
                    pitch: CesiumMath.toRadians(-45),
                    roll: 0.0,
                },
                duration: 2,
            });
        };

        initViewer().catch(console.error);

        // Cleanup
        return () => {
            if (viewer) {
                viewer.destroy();
            }
        };
    }, [buildingData, location]);

    return (
        <Box sx={{ height: 'calc(100vh - 100px)', display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Paper sx={{ p: 2 }}>
                <Typography variant="h5" gutterBottom>
                    Ubicación del Proyecto
                </Typography>
                <Typography variant="body2">
                    {buildingData ? (
                        `${buildingData.name} - Coordenadas: ${location.latitude.toFixed(6)}°, ${location.longitude.toFixed(6)}°`
                    ) : (
                        'Cargando datos del proyecto...'
                    )}
                </Typography>
            </Paper>

            <Paper
                sx={{
                    flexGrow: 1,
                    overflow: 'hidden',
                    position: 'relative',
                    '& .cesium-viewer-toolbar, .cesium-viewer-bottom': {
                        display: 'none',
                    },
                }}
            >
                <div
                    ref={containerRef}
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                    }}
                />
            </Paper>

            {!buildingData && (
                <Alert severity="info" sx={{ mt: 2 }}>
                    Usando ubicación predeterminada. Cargue un proyecto desde Revit para ver la ubicación real.
                </Alert>
            )}
        </Box>
    );
}

export default Map3D;

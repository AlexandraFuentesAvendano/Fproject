import { Box, Grid, Paper, Typography } from '@mui/material';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

interface EnergyData {
    area: number;
    orientacion: number;
    material: string;
    energia: number;
}

interface EnergyVisualizationProps {
    data: EnergyData[];
}

function EnergyVisualization({ data }: EnergyVisualizationProps) {
    const mountRef = useRef<HTMLDivElement>(null);
    const sceneRef = useRef<{
        scene: THREE.Scene;
        camera: THREE.PerspectiveCamera;
        renderer: THREE.WebGLRenderer;
        controls: OrbitControls;
    } | null>(null);

    // Procesar datos para visualización
    const processData = () => {
        // Agrupar por orientación
        const groupedByOrientation = data.reduce((acc, item) => {
            const key = item.orientacion.toString();
            if (!acc[key]) {
                acc[key] = [];
            }
            acc[key].push(item);
            return acc;
        }, {} as Record<string, EnergyData[]>);

        // Calcular energía total por orientación
        return Object.entries(groupedByOrientation).map(([orientation, items]) => ({
            orientation: parseFloat(orientation),
            totalEnergy: items.reduce((sum, item) => sum + item.energia, 0),
            totalArea: items.reduce((sum, item) => sum + item.area, 0),
            averageEnergy: items.reduce((sum, item) => sum + item.energia, 0) / items.length,
        }));
    };

    useEffect(() => {
        if (!mountRef.current) return;

        // Scene setup
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(
            75,
            mountRef.current.clientWidth / mountRef.current.clientHeight,
            0.1,
            1000
        );
        const renderer = new THREE.WebGLRenderer({ antialias: true });

        renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
        renderer.shadowMap.enabled = true;
        mountRef.current.appendChild(renderer.domElement);

        // Controls
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;

        // Lighting
        const ambientLight = new THREE.AmbientLight(0x404040);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(5, 5, 5);
        directionalLight.castShadow = true;
        scene.add(directionalLight);

        // Process energy data
        const processedData = processData();

        // Create visualization
        const radius = 5;
        const height = 2;
        const segments = 32;

        processedData.forEach(({ orientation, averageEnergy, totalArea }) => {
            // Crear cilindro para cada orientación
            const geometry = new THREE.CylinderGeometry(
                0.5,
                0.5,
                averageEnergy * height,
                segments
            );

            // Color basado en la energía (rojo = alta energía, azul = baja energía)
            const energyColor = new THREE.Color().setHSL(
                (1 - averageEnergy / 5) * 0.6, // Hue: 0 = rojo (alta energía), 0.6 = azul (baja energía)
                1,
                0.5
            );

            const material = new THREE.MeshStandardMaterial({
                color: energyColor,
                metalness: 0.3,
                roughness: 0.7,
            });

            const cylinder = new THREE.Mesh(geometry, material);

            // Posicionar según orientación
            const angle = (orientation + 90) * Math.PI / 180; // +90 para alinear con norte
            cylinder.position.x = Math.cos(angle) * radius;
            cylinder.position.z = Math.sin(angle) * radius;
            cylinder.position.y = (averageEnergy * height) / 2;

            scene.add(cylinder);

            // Añadir etiqueta de orientación
            const directions: Record<number, string> = {
                0: 'N',
                90: 'E',
                180: 'S',
                '-90': 'W',
            };

            // Crear sprite para la etiqueta
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            if (context) {
                canvas.width = 256;
                canvas.height = 256;
                context.fillStyle = 'white';
                context.font = 'Bold 60px Arial';
                context.textAlign = 'center';
                context.fillText(directions[orientation] || orientation.toString() + '°', 128, 128);
            }

            const texture = new THREE.CanvasTexture(canvas);
            const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
            const sprite = new THREE.Sprite(spriteMaterial);
            sprite.position.set(
                Math.cos(angle) * (radius + 1),
                0,
                Math.sin(angle) * (radius + 1)
            );
            sprite.scale.set(2, 2, 2);
            scene.add(sprite);
        });

        // Add center reference
        const centerGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.1, 32);
        const centerMaterial = new THREE.MeshBasicMaterial({ color: 0xcccccc });
        const centerMesh = new THREE.Mesh(centerGeometry, centerMaterial);
        scene.add(centerMesh);

        // Camera position
        camera.position.set(15, 15, 15);
        camera.lookAt(0, 0, 0);

        // Store references
        sceneRef.current = {
            scene,
            camera,
            renderer,
            controls,
        };

        // Animation loop
        const animate = () => {
            requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera);
        };
        animate();

        // Handle window resize
        const handleResize = () => {
            if (!mountRef.current) return;

            camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
        };
        window.addEventListener('resize', handleResize);

        // Cleanup
        return () => {
            window.removeEventListener('resize', handleResize);
            if (mountRef.current) {
                mountRef.current.removeChild(renderer.domElement);
            }
            renderer.dispose();
        };
    }, [data]);

    return (
        <Box sx={{ height: 'calc(100vh - 200px)', display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Paper sx={{ p: 2, mt: 4 }}>
                <Typography variant="h5" gutterBottom>
                    Energy Visualization
                </Typography>
                <Typography variant="body2">
                    3D visualization of energy by orientation. The height and color of each cylinder represents the average energy.
                    Red indicates higher energy, blue indicates lower energy.
                </Typography>
            </Paper>

            <Paper
                ref={mountRef}
                sx={{
                    flexGrow: 1,
                    overflow: 'hidden',
                    position: 'relative',
                    '& canvas': {
                        outline: 'none',
                    },
                }}
            />

            <Grid container spacing={2}>
                {processData().map(({ orientation, averageEnergy, totalArea }) => (
                    <Grid item xs={12} sm={6} md={3} key={orientation}>
                        <Paper sx={{ p: 2 }}>
                            <Typography variant="subtitle1">
                                Orientation: {orientation}°
                            </Typography>
                            <Typography variant="body2">
                                Average energy: {averageEnergy.toFixed(2)} kWh/m²
                            </Typography>
                            <Typography variant="body2">
                                Total Area: {totalArea.toFixed(2)} m²
                            </Typography>
                        </Paper>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}

export default EnergyVisualization;

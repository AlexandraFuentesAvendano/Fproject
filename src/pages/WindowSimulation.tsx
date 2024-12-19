import { Box, MenuItem, Select, Typography } from "@mui/material";
import React, { useState } from "react";

const WindowSimulator: React.FC = () => {
    const [selectedMaterial, setSelectedMaterial] = useState<string>("Glass");

    const handleMaterialChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        setSelectedMaterial(event.target.value as string);
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Window Simulator
            </Typography>
            <Typography variant="body1">
                Seleccione el material para la ventana:
            </Typography>

            <Select
                value={selectedMaterial}
                onChange={handleMaterialChange}
                displayEmpty
                sx={{ mb: 2 }}
            >
                <MenuItem value="Glass">Glass</MenuItem>
                <MenuItem value="Wood">Wood</MenuItem>
                <MenuItem value="Metal">Metal</MenuItem>
            </Select>

            <Box sx={{ p: 2, border: "1px solid gray", borderRadius: "8px" }}>
                <Typography variant="h6">Material seleccionado:</Typography>
                <Typography variant="body1" color="primary">
                    {selectedMaterial}
                </Typography>
            </Box>
        </Box>
    );
};

export default WindowSimulator;

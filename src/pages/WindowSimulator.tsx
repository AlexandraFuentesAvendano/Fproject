import React, { useState } from "react";

const WindowSimulator: React.FC = () => {
    const [selectedMaterial, setSelectedMaterial] = useState("");

    const materials = ["Glass", "Wood", "Aluminum", "Plastic"]; // Opciones de materiales

    return (
        <div style={{ padding: "20px" }}>
            <h2>Simulador de Ventanas</h2>

            {/* Dropdown para elegir material */}
            <label htmlFor="material-select">Selecciona un material:</label>
            <select
                id="material-select"
                value={selectedMaterial}
                onChange={(e) => setSelectedMaterial(e.target.value)}
            >
                <option value="">--Elige un material--</option>
                {materials.map((material, index) => (
                    <option key={index} value={material}>
                        {material}
                    </option>
                ))}
            </select>

            {/* Mostrar el material seleccionado */}
            {selectedMaterial && (
                <div style={{ marginTop: "20px" }}>
                    <h3>Material Seleccionado:</h3>
                    <p>{selectedMaterial}</p>
                </div>
            )}
        </div>
    );
};

export default WindowSimulator;
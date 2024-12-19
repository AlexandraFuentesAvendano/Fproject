import { Box, CssBaseline, ThemeProvider } from '@mui/material';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import { BuildingProvider } from './context/BuildingContext';
import EnergyAnalysis from './pages/EnergyAnalysis';
import Home from './pages/Home';
import LightSimulation from './pages/LightSimulation';
import Settings from './pages/Settings';
import theme from './theme';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <BuildingProvider>
        <CssBaseline />
        <Router>
          <Layout>
            <Box sx={{ flexGrow: 1, p: 3 }}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/light-simulation" element={<LightSimulation />} />
                <Route path="/energy-analysis" element={<EnergyAnalysis />} />
                <Route path="/settings" element={<Settings />} />
              </Routes>
            </Box>
          </Layout>
        </Router>
      </BuildingProvider>
    </ThemeProvider>
  );
}

export default App;

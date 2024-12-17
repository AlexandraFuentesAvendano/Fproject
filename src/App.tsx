import { Box, CssBaseline, ThemeProvider } from '@mui/material';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import EnergyAnalysis from './pages/EnergyAnalysis';
import Home from './pages/Home';
import LightSimulation from './pages/LightSimulation';
import Map3D from './pages/Map3D';
import Settings from './pages/Settings';
import theme from './theme';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Layout>
          <Box sx={{ flexGrow: 1, p: 3 }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/map" element={<Map3D />} />
              <Route path="/light-simulation" element={<LightSimulation />} />
              <Route path="/energy-analysis" element={<EnergyAnalysis />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </Box>
        </Layout>
      </Router>
    </ThemeProvider>
  );
}

export default App;

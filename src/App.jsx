import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Sillas from './pages/Sillas';
import Clientes from './pages/Clientes';
import Barberos from './pages/Barberos';
import Citas from './pages/Citas';
import Reportes from './pages/Reportes';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/"           element={<Dashboard />} />
            <Route path="/sillas"     element={<Sillas />} />
            <Route path="/clientes"   element={<Clientes />} />
            <Route path="/barberos"   element={<Barberos />} />
            <Route path="/citas"      element={<Citas />} />
            <Route path="/reportes"   element={<Reportes />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </AppProvider>
  );
}

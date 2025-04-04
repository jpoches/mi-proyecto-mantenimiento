// client/src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Contexto de autenticación
import { AuthProvider, useAuth } from './context/AuthContext';

// Layout components
import Layout from './components/Layout/Layout';

// Pages
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Dashboard from './pages/Dashboard/Dashboard';
import Clients from './pages/Clients/Clients';
import ServicePersonnel from './pages/ServicePersonnel/ServicePersonnel';
import Requests from './pages/Requests/Requests';
import WorkOrders from './pages/WorkOrders/WorkOrders';
import Tasks from './pages/Tasks/Tasks';
import Invoices from './pages/Invoices/Invoices';
import Calendar from './pages/Calendar/Calendar';
import Profile from './pages/Profile/Profile';
import NotFound from './pages/NotFound/NotFound';

// En App.js o donde tengas definido ProtectedRoute
const ProtectedRoute = ({ children, allowedRoles }) => {
  // Verificar directamente desde localStorage en lugar de confiar en el contexto
  const token = localStorage.getItem("token");
  const userString = localStorage.getItem("user");
  
  console.log('Token en localStorage:', !!token);
  console.log('User en localStorage:', userString);
  
  if (!token || !userString) {
    console.log('No hay token o usuario, redirigiendo a login');
    return <Navigate to="/login" />;
  }
  
  // Si hay roles permitidos, verificarlos
  if (allowedRoles) {
    const user = JSON.parse(userString);
    console.log('Rol del usuario:', user.role);
    console.log('Roles permitidos:', allowedRoles);
    
    if (!allowedRoles.includes(user.role)) {
      console.log('Rol no permitido, redirigiendo a dashboard');
      return <Navigate to="/dashboard" />;
    }
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Rutas protegidas */}
          <Route path="/" element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="/dashboard" />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="profile" element={<Profile />} />
            
            {/* Rutas de cliente */}
            <Route path="requests" element={
              <ProtectedRoute allowedRoles={['client', 'admin']}>
                <Requests />
              </ProtectedRoute>
            } />
            <Route path="calendar" element={<Calendar />} />
            <Route path="invoices" element={<Invoices />} />
            
            {/* Rutas de técnico */}
            <Route path="work-orders" element={
              <ProtectedRoute allowedRoles={['technician', 'admin']}>
                <WorkOrders />
              </ProtectedRoute>
            } />
            <Route path="tasks" element={
              <ProtectedRoute allowedRoles={['technician', 'admin']}>
                <Tasks />
              </ProtectedRoute>
            } />
            
            {/* Rutas de administrador */}
            <Route path="clients" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Clients />
              </ProtectedRoute>
            } />
            <Route path="service-personnel" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <ServicePersonnel />
              </ProtectedRoute>
            } />
          </Route>

          {/* Ruta 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
      <ToastContainer position="top-right" autoClose={3000} />
    </AuthProvider>
  );
}

export default App;
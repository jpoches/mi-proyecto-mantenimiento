// client/src/App.js
import React, { Suspense, lazy, useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Contextos de la aplicación
import { AuthProvider } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import ProtectedRoute from './components/Auth/ProtectedRoute';

// Componentes UI
import LoadingScreen from './components/UI/LoadingScreen';
import ErrorBoundary from './components/UI/ErrorBoundary';
import Loader from './components/UI/Loader';

// Utilidades
import axios from './utils/axios';
import { API_URL } from './config/api';

// Verificar el estado de la API antes de cargar la aplicación
const verifyApiConnection = async () => {
  try {
    const response = await fetch(`${API_URL}/`);
    if (!response.ok) throw new Error('API no disponible');
    return true;
  } catch (error) {
    console.error('Error al conectar con la API:', error);
    return false;
  }
};

// Layout principal con carga diferida
const Layout = lazy(() => import('./components/Layout/Layout'));

// Páginas con carga diferida para mejor rendimiento
const Login = lazy(() => import('./pages/Auth/Login'));
const Register = lazy(() => import('./pages/Auth/Register'));
const Dashboard = lazy(() => import('./pages/Dashboard/Dashboard'));
const Clients = lazy(() => import('./pages/Clients/Clients'));
const ServicePersonnel = lazy(() => import('./pages/ServicePersonnel/ServicePersonnel'));
const Requests = lazy(() => import('./pages/Requests/Requests'));
const WorkOrders = lazy(() => import('./pages/WorkOrders/WorkOrders'));
const Tasks = lazy(() => import('./pages/Tasks/Tasks'));
const Invoices = lazy(() => import('./pages/Invoices/Invoices'));
const Calendar = lazy(() => import('./pages/Calendar/Calendar'));
const Profile = lazy(() => import('./pages/Profile/Profile'));
const Quotes = lazy(() => import('./pages/Quotes/Quotes'));
const NotFound = lazy(() => import('./pages/NotFound/NotFound'));
const ServerError = lazy(() => import('./pages/Error/ServerError'));
const Unauthorized = lazy(() => import('./pages/Error/Unauthorized'));

function App() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [apiAvailable, setApiAvailable] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  
  // Verificar conexión a la API al iniciar
  useEffect(() => {
    const checkApiStatus = async () => {
      setIsLoading(true);
      const isAvailable = await verifyApiConnection();
      setApiAvailable(isAvailable);
      setIsLoading(false);
    };
    
    checkApiStatus();
    
    // Configuración global de axios
    axios.defaults.baseURL = API_URL;
    
    // Recuperar token del localStorage si existe
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, []);
  
  // Monitorear el estado de la conexión a internet
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  // Pantalla de carga inicial mientras se verifica la API
  if (isLoading) {
    return <LoadingScreen text="Iniciando aplicación..." />;
  }
  
  // Mostrar mensaje de conexión perdida a internet
  if (!isOnline) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
          <div className="text-red-500 text-6xl mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-2">Sin conexión a Internet</h1>
          <p className="text-gray-600 mb-4">
            No se puede conectar con el servidor. Por favor, verifica tu conexión a Internet.
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }
  
  // Mostrar error si la API no está disponible
  if (!apiAvailable) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
          <div className="text-red-500 text-6xl mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-2">Servidor no disponible</h1>
          <p className="text-gray-600 mb-4">
            No se puede conectar con el servidor de la aplicación. Por favor, intente nuevamente más tarde.
          </p>
          <div className="flex justify-center space-x-4">
            <button 
              onClick={() => window.location.reload()}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Reintentar
            </button>
            <button 
              onClick={() => setApiAvailable(true)} // Bypass para desarrollo
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Continuar de todos modos
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <AppProvider>
            <Suspense fallback={<Loader text="Cargando..." />}>
              <Routes>
                {/* Rutas públicas */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                
                {/* Páginas de error */}
                <Route path="/error" element={<ServerError />} />
                <Route path="/unauthorized" element={<Unauthorized />} />

                {/* Rutas protegidas */}
                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <Layout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<Navigate to="/dashboard" />} />
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="profile" element={<Profile />} />
                  
                  {/* Rutas de cliente */}
                  <Route
                    path="requests"
                    element={
                      <ProtectedRoute allowedRoles={['client', 'admin']}>
                        <Requests />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="quotes"
                    element={
                      <ProtectedRoute allowedRoles={['client', 'admin']}>
                        <Quotes />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="calendar"
                    element={
                      <ProtectedRoute>
                        <Calendar />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="invoices"
                    element={
                      <ProtectedRoute allowedRoles={['client', 'admin']}>
                        <Invoices />
                      </ProtectedRoute>
                    }
                  />
                  
                  {/* Rutas de técnico */}
                  <Route
                    path="work-orders"
                    element={
                      <ProtectedRoute allowedRoles={['technician', 'admin']}>
                        <WorkOrders />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="tasks"
                    element={
                      <ProtectedRoute allowedRoles={['technician', 'admin']}>
                        <Tasks />
                      </ProtectedRoute>
                    }
                  />
                  
                  {/* Rutas de administrador */}
                  <Route
                    path="clients"
                    element={
                      <ProtectedRoute allowedRoles={['admin']}>
                        <Clients />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="service-personnel"
                    element={
                      <ProtectedRoute allowedRoles={['admin']}>
                        <ServicePersonnel />
                      </ProtectedRoute>
                    }
                  />
                </Route>

                {/* Ruta 404 */}
                <Route path="*" element={<NotFound />} />
              </Routes>
              
              <ToastContainer 
                position="top-right" 
                autoClose={4000} 
                hideProgressBar={false} 
                newestOnTop 
                closeOnClick 
                rtl={false} 
                pauseOnFocusLoss 
                draggable 
                pauseOnHover
                theme="colored"
              />
            </Suspense>
          </AppProvider>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
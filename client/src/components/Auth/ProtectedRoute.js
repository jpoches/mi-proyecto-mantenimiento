// src/components/Auth/ProtectedRoute.js
import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Loader from '../UI/Loader';

/**
 * Componente para proteger rutas que requieren autenticación
 * @param {Object} props - Propiedades del componente
 * @param {React.ReactNode} props.children - Contenido a mostrar si está autenticado
 * @param {Array} props.allowedRoles - Array con los roles permitidos (opcional)
 * @param {boolean} props.requireAuth - Si se requiere autenticación (por defecto: true)
 * @param {boolean} props.redirectToLogin - Si debe redirigir a login (por defecto: true)
 * @param {string} props.redirectTo - Ruta a la que redirigir si no está autenticado (por defecto: '/login')
 * @returns {React.ReactNode} El contenido protegido o una redirección
 */
const ProtectedRoute = ({ 
  children, 
  allowedRoles = null,
  requireAuth = true,
  redirectToLogin = true,
  redirectTo = '/login'
}) => {
  const { 
    isAuthenticated, 
    currentUser, 
    authChecked, 
    checkAuthStatus, 
    loading 
  } = useAuth();
  const [isChecking, setIsChecking] = useState(true);
  const location = useLocation();
  
  useEffect(() => {
    const verifyAuth = async () => {
      if (!authChecked) {
        await checkAuthStatus();
      }
      setIsChecking(false);
    };
    
    verifyAuth();
  }, [authChecked, checkAuthStatus]);
  
  // Mostrar loader mientras se verifica la autenticación
  if (loading || isChecking) {
    return <Loader text="Verificando acceso..." />;
  }
  
  // Si no se requiere autenticación, mostrar contenido
  if (!requireAuth) {
    return children;
  }
  
  // Redirigir a login si no está autenticado y se requiere autenticación
  if (!isAuthenticated && requireAuth) {
    // Guardar la ruta actual para redirigir después del login
    return redirectToLogin ? (
      <Navigate to={redirectTo} state={{ from: location }} replace />
    ) : (
      <Navigate to={redirectTo} replace />
    );
  }
  
  // Verificar roles (si se especificaron)
  if (allowedRoles && Array.isArray(allowedRoles) && allowedRoles.length > 0) {
    if (!currentUser || !allowedRoles.includes(currentUser.role)) {
      // Redirigir a página de acceso denegado si no tiene los permisos necesarios
      return <Navigate to="/unauthorized" replace />;
    }
  }
  
  // Si pasa todas las verificaciones, mostrar el componente protegido
  return children;
};

export default ProtectedRoute;
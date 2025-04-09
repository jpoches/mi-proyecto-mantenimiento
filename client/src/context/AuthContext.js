// src/context/AuthContext.js (versión corregida)
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "../utils/axios";

// Crear el contexto de autenticación
const AuthContext = createContext(null);

// Hook personalizado para usar el contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }
  return context;
};

// Proveedor del contexto de autenticación
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const navigate = useNavigate();

  const checkAuthStatus = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Verificar si hay token en localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        setIsAuthenticated(false);
        setCurrentUser(null);
        setAuthChecked(true);
        setLoading(false);
        return false;
      }

      // Verificar si el token es válido haciendo una solicitud al servidor
      const response = await axios.get('/auth/me');
      
      if (response) {
        setCurrentUser(response);
        setIsAuthenticated(true);
        setAuthChecked(true);
        setLoading(false);
        return true;
      } else {
        // Si no hay datos del usuario, limpiar localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setIsAuthenticated(false);
        setCurrentUser(null);
        setAuthChecked(true);
        setLoading(false);
        return false;
      }
    } catch (error) {
      console.error("Error al verificar estado de autenticación:", error);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setIsAuthenticated(false);
      setCurrentUser(null);
      setError("Sesión expirada. Por favor, inicie sesión nuevamente.");
      setAuthChecked(true);
      setLoading(false);
      return false;
    }
  }, []);

  // Efecto para ejecutar la verificación cuando el componente se monta
  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  const login = async (username, password) => {
    try {
      setLoading(true);
      const response = await axios.post('/auth/signin', { username, password });
      
      const { user, accessToken } = response;
      
      // Guardar token y usuario en localStorage
      localStorage.setItem('token', accessToken);
      localStorage.setItem('user', JSON.stringify(user));
      
      setCurrentUser(user);
      setIsAuthenticated(true);
      toast.success("Inicio de sesión exitoso");
      
      return true;
    } catch (error) {
      setError("Credenciales inválidas");
      toast.error("Error al iniciar sesión");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setCurrentUser(null);
    setIsAuthenticated(false);
    toast.info("Sesión cerrada");
    navigate("/login");
  };

  const value = {
    currentUser,
    isAuthenticated,
    loading,
    error,
    authChecked,
    login,
    logout,
    checkAuthStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
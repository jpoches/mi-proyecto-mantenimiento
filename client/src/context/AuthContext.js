// client/src/context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Al cargar, verificar si hay un usuario guardado
  useEffect(() => {
    const checkLoggedIn = () => {
      const token = localStorage.getItem("token");
      const user = localStorage.getItem("user");
      
      if (token && user) {
        const userData = JSON.parse(user);
        setCurrentUser(userData);
        setIsAuthenticated(true);
        
        // Configurar axios para usar el token
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      }
      
      setLoading(false);
    };

    checkLoggedIn();
  }, []);

  // Función de logout simplificada
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setCurrentUser(null);
    setIsAuthenticated(false);
    delete axios.defaults.headers.common["Authorization"];
    window.location.href = '/login';
  };

  const value = {
    currentUser,
    isAuthenticated,
    loading,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
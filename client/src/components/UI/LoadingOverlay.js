// src/components/UI/LoadingOverlay.js (corregido)
import React from 'react';

/**
 * Componente para mostrar un overlay de carga dentro de un contenedor específico
 * @param {Object} props - Propiedades del componente
 * @param {boolean} props.loading - Indica si está cargando
 * @param {string} props.text - Texto a mostrar durante la carga
 * @param {React.ReactNode} props.children - Contenido que se mostrará cuando no esté cargando
 * @param {string} props.className - Clases adicionales para el contenedor
 */
const LoadingOverlay = ({ 
  loading = false, 
  text = "Cargando...", 
  children, 
  className = ""
}) => {
  return (
    <div className={`relative ${className}`}>
      {children}
      
      {loading && (
        <div className="absolute inset-0 bg-white bg-opacity-70 flex flex-col justify-center items-center rounded-lg z-10">
          {/* Spinner más pequeño para el overlay */}
          <div className="relative w-12 h-12 mb-3">
            <div className="absolute inset-0 border-4 border-t-blue-500 border-r-transparent border-b-blue-300 border-l-transparent rounded-full animate-spin"></div>
          </div>
          
          {/* Texto de carga */}
          {text && (
            <p className="text-gray-700 font-medium">{text}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default LoadingOverlay;
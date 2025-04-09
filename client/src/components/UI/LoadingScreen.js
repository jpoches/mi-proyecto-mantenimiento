// src/components/UI/LoadingScreen.js
import React from 'react';

/**
 * Pantalla de carga para la aplicación completa
 * Usa un diseño más elaborado para la carga inicial
 */
const LoadingScreen = ({ text = "Cargando..." }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-lg w-full text-center relative overflow-hidden">
        {/* Efecto de brillo animado */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg blur opacity-30 animate-pulse"></div>
        
        {/* Logo de la empresa (puedes reemplazar esto con tu propio logo) */}
        <div className="relative mb-8 mx-auto">
          <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-800">
            Álvarez Construcciones
          </div>
          <div className="text-sm text-gray-500 mt-1">Sistema de Mantenimiento</div>
        </div>

        {/* Animación de carga más elaborada */}
        <div className="flex justify-center mb-8">
          <div className="relative w-24 h-24">
            {/* Círculos animados */}
            <div className="absolute inset-0 border-8 border-blue-200 rounded-full"></div>
            <div className="absolute inset-0 border-8 border-transparent border-t-blue-600 rounded-full animate-spin"></div>
            <div className="absolute inset-4 border-8 border-transparent border-t-indigo-600 border-r-indigo-600 rounded-full animate-spin-reverse"></div>
            
            {/* Punto central */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-4 h-4 bg-blue-600 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Mensaje de carga */}
        <p className="text-xl font-semibold text-gray-800 mb-2">{text}</p>
        <p className="text-gray-500 mb-6">Por favor espere mientras cargamos todo para usted</p>

        {/* Barra de progreso animada */}
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 animate-progress-bar"></div>
        </div>
      </div>
      
      {/* Créditos en la parte inferior */}
      <div className="mt-8 text-gray-500 text-sm">
        © {new Date().getFullYear()} Álvarez Construcciones
      </div>
    </div>
  );
};

export default LoadingScreen;
// src/components/UI/Loader.js
import React, { useEffect } from 'react';

/**
 * Componente para mostrar un loader con diferentes variantes
 * @param {Object} props - Propiedades del componente
 * @param {string} props.text - Texto a mostrar durante la carga
 * @param {string} props.variant - Variante del loader ('fullscreen', 'overlay', 'inline')
 * @param {boolean} props.blockScroll - Si se debe bloquear el scroll mientras se muestra el loader
 * @param {string} props.size - Tamaño del loader ('sm', 'md', 'lg')
 * @param {string} props.color - Color principal del loader
 * @returns {React.ReactNode} Componente de loader
 */
const Loader = ({ 
  text = "Cargando...", 
  variant = "fullscreen", 
  blockScroll = true,
  size = "md",
  color = "blue"
}) => {
  // Efecto para prevenir el scroll mientras el loader está activo
  useEffect(() => {
    if (blockScroll && (variant === 'fullscreen' || variant === 'overlay')) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = 'auto';
      };
    }
  }, [blockScroll, variant]);

  // Mapeo de tamaños para los elementos del loader
  const sizeMap = {
    sm: {
      container: "w-4 h-4",
      dot: "w-1 h-1",
      text: "text-sm"
    },
    md: {
      container: "w-8 h-8",
      dot: "w-2 h-2",
      text: "text-base"
    },
    lg: {
      container: "w-16 h-16",
      dot: "w-3 h-3",
      text: "text-lg"
    }
  };

  // Mapeo de colores para los elementos del loader
  const colorMap = {
    blue: {
      primary: "bg-blue-600",
      secondary: "bg-blue-400",
      tertiary: "bg-blue-300",
      text: "text-blue-700"
    },
    green: {
      primary: "bg-green-600",
      secondary: "bg-green-400",
      tertiary: "bg-green-300",
      text: "text-green-700"
    },
    red: {
      primary: "bg-red-600",
      secondary: "bg-red-400",
      tertiary: "bg-red-300",
      text: "text-red-700"
    },
    yellow: {
      primary: "bg-yellow-500",
      secondary: "bg-yellow-400",
      tertiary: "bg-yellow-300",
      text: "text-yellow-700"
    },
    gray: {
      primary: "bg-gray-600",
      secondary: "bg-gray-400",
      tertiary: "bg-gray-300",
      text: "text-gray-700"
    }
  };

  // Obtener las clases según el tamaño y color
  const sizeClasses = sizeMap[size] || sizeMap.md;
  const colorClasses = colorMap[color] || colorMap.blue;

  // Componente de tres puntos rebotando (para todos los variantes)
  const BouncingDots = () => (
    <div className={`flex justify-center space-x-2 ${sizeClasses.container}`}>
      <div className={`${sizeClasses.dot} ${colorClasses.primary} rounded-full animate-bounce-dot`} style={{ animationDelay: '0ms' }}></div>
      <div className={`${sizeClasses.dot} ${colorClasses.secondary} rounded-full animate-bounce-dot`} style={{ animationDelay: '200ms' }}></div>
      <div className={`${sizeClasses.dot} ${colorClasses.tertiary} rounded-full animate-bounce-dot`} style={{ animationDelay: '400ms' }}></div>
    </div>
  );

  // Variante fullscreen (cubre toda la pantalla)
  if (variant === 'fullscreen') {
    return (
      <div className="fixed inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full relative overflow-hidden">
          {/* Barra de progreso animada en la parte superior */}
          <div className="absolute top-0 left-0 h-1 w-full bg-gray-200">
            <div className={`h-full ${colorClasses.primary} animate-progress-bar`}></div>
          </div>
          
          <div className="text-center">
            {/* Loader circular animado */}
            <div className="mx-auto mb-6 relative w-20 h-20">
              <div className={`absolute inset-0 border-4 border-t-${color}-600 border-r-${color}-400 border-b-${color}-300 border-l-${color}-500 rounded-full animate-spin`}></div>
              <div className={`absolute inset-3 border-4 border-t-${color}-500 border-r-${color}-300 border-b-${color}-200 border-l-${color}-400 rounded-full animate-spin-reverse`}></div>
              <div className="absolute inset-0 w-full h-full flex justify-center items-center">
                <div className={`w-3 h-3 ${colorClasses.primary} rounded-full animate-pulse`}></div>
              </div>
            </div>
            
            {/* Texto de carga con efecto de escritura */}
            <div className={`${sizeClasses.text} font-bold ${colorClasses.text} mb-2`}>
              {text}
            </div>
            
            {/* Puntos animados */}
            <div className="flex justify-center space-x-1 mt-2">
              <BouncingDots />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Variante overlay (semi-transparente, no cubre toda la pantalla)
  if (variant === 'overlay') {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-75 flex justify-center items-center z-40">
        <div className="text-center p-6 rounded-lg">
          <div className="flex flex-col items-center">
            <div className="mb-4">
              <BouncingDots />
            </div>
            {text && (
              <p className={`${sizeClasses.text} ${colorClasses.text} font-medium`}>{text}</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Variante inline (dentro del contenido)
  return (
    <div className="flex items-center justify-center py-4">
      <div className="mr-3">
        <BouncingDots />
      </div>
      {text && (
        <p className={`${sizeClasses.text} ${colorClasses.text} font-medium`}>{text}</p>
      )}
    </div>
  );
};

export default Loader;
// client/src/components/Layout/Logo.js
import React from 'react';
import { Link } from 'react-router-dom';

const Logo = ({ className = "", size = "normal" }) => {
  // Tamaños para diferentes variantes del logo
  const sizes = {
    small: "h-8",
    normal: "h-12",
    large: "h-16"
  };

  return (
    <Link to="/dashboard" className={`flex items-center ${className}`}>
      <img 
        src="/logo-alvarez.png" 
        alt="Álvarez Construcciones"
        className={`${sizes[size]} object-contain`}
      />
      <div className="ml-2 flex flex-col">
        <span className="text-lg font-bold text-gray-800 leading-tight">Álvarez</span>
        <span className="text-xs font-medium text-gray-600 leading-tight">CONSTRUCCIONES</span>
      </div>
    </Link>
  );
};

export default Logo;
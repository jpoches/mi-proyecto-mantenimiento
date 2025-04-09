// client/src/pages/Error/Unauthorized.js
import React from 'react';
import { Link } from 'react-router-dom';
import { FaLock, FaHome, FaSignInAlt } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

const Unauthorized = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-lg shadow-md text-center">
        <div>
          <FaLock className="mx-auto h-16 w-16 text-yellow-500" />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Acceso Denegado
          </h2>
          <p className="mt-2 text-center text-md text-gray-600">
            No tiene permisos para acceder a esta página. Por favor, contacte al administrador si cree que esto es un error.
          </p>
        </div>

        <div className="mt-6 flex flex-col space-y-4">
          <Link
            to="/dashboard"
            className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
          >
            <FaHome className="mr-2" />
            Volver al inicio
          </Link>

          {!isAuthenticated && (
            <Link
              to="/login"
              className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none"
            >
              <FaSignInAlt className="mr-2" />
              Iniciar sesión
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;

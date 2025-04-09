// client/src/pages/Error/ServerError.js
import React from 'react';
import { Link } from 'react-router-dom';
import { FaExclamationTriangle, FaHome, FaRedo } from 'react-icons/fa';

const ServerError = () => {
  const handleReload = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-lg shadow-md text-center">
        <div>
          <FaExclamationTriangle className="mx-auto h-16 w-16 text-red-500" />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Error del servidor
          </h2>
          <p className="mt-2 text-center text-md text-gray-600">
            Lo sentimos, ha ocurrido un error en el servidor. Nuestro equipo técnico ha sido notificado.
          </p>
        </div>
        <div className="mt-6 flex flex-col space-y-4">
          <button
            onClick={handleReload}
            className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
          >
            <FaRedo className="mr-2" />
            Intentar nuevamente
          </button>
          <Link
            to="/dashboard"
            className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none"
          >
            <FaHome className="mr-2" />
            Volver al inicio
          </Link>
        </div>
        <div className="mt-4">
          <p className="text-sm text-gray-500">
            Si el problema persiste, por favor contacte al soporte técnico.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ServerError;
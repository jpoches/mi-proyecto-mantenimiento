// client/src/pages/NotFound/NotFound.js
import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaExclamationTriangle } from 'react-icons/fa';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-lg shadow-md text-center">
        <div>
          <FaExclamationTriangle className="mx-auto h-16 w-16 text-yellow-500" />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Página no encontrada
          </h2>
          <p className="mt-2 text-center text-md text-gray-600">
            Lo sentimos, la página que estás buscando no existe o ha sido movida.
          </p>
        </div>
        <div className="mt-6">
          <Link
            to="/dashboard"
            className="inline-flex items-center justify-center w-full px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
          >
            <FaHome className="mr-2" />
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
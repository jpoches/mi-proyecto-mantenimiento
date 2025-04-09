// client/src/pages/DevTools/ConnectionTest.js
import React from 'react';
import ConnectionTest from '../../components/UI/ConnectionTest';
import { FaTools, FaArrowLeft } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const ConnectionTestPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold flex items-center">
            <FaTools className="mr-2 text-blue-600" />
            Herramientas de Desarrollo
          </h1>
          
          <Link 
            to="/login" 
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            <FaArrowLeft className="mr-1" /> Volver a Login
          </Link>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Acerca de esta herramienta</h2>
          <p className="text-gray-700 mb-4">
            Esta página permite verificar la conexión entre el frontend y el backend de la aplicación.
            Es útil para diagnosticar problemas de comunicación durante el desarrollo.
          </p>
          
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  Esta herramienta es solo para entornos de desarrollo. No debe estar disponible en producción.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-6">
          <ConnectionTest />
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Solución de problemas comunes</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-800">Error de CORS</h3>
                <p className="text-gray-600">
                  Si ve errores de CORS en la consola del navegador, verifique que el backend tenga configurado correctamente los encabezados CORS para permitir solicitudes desde el origen del frontend.
                </p>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-800">Error de conexión rechazada</h3>
                <p className="text-gray-600">
                  Asegúrese de que el servidor backend esté ejecutándose y que la URL configurada en <code>config/api.js</code> sea correcta.
                </p>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-800">Error de autenticación</h3>
                <p className="text-gray-600">
                  Verifique que las credenciales de prueba sean correctas y que la base de datos tenga el usuario administrador creado.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConnectionTestPage;
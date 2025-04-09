// client/src/components/UI/ConnectionTest.js
import React, { useState } from 'react';
import axios from '../../utils/axios';
import { toast } from 'react-toastify';
import { FaServer, FaCheck, FaTimes, FaSync } from 'react-icons/fa';

const ConnectionTest = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [serverStatus, setServerStatus] = useState(null);
  const [apiVersion, setApiVersion] = useState(null);
  const [error, setError] = useState(null);

  // Probar la conexión al servidor
  const testConnection = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Intentar conectar a la ruta principal del API
      const response = await axios.get('/');
      
      setServerStatus('online');
      setApiVersion(response.data.version || 'Desconocida');
      toast.success('¡Conexión establecida con el servidor!');
    } catch (error) {
      setServerStatus('offline');
      setError(error.message || 'Error de conexión');
      toast.error('No se pudo conectar con el servidor API');
    } finally {
      setIsLoading(false);
    }
  };

  // Probar la autenticación
  const testAuth = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Intentar autenticar con credenciales de prueba
      const response = await axios.post('/auth/signin', {
        username: 'admin',
        password: 'admin123'
      });
      
      if (response.data.accessToken) {
        toast.success('¡Autenticación exitosa!');
        setError(null);
      } else {
        toast.warning('No se recibió un token de autenticación');
        setError('No token');
      }
    } catch (error) {
      setError(error.message || 'Error de autenticación');
      toast.error('Error al autenticar: ' + (error.response?.data?.message || error.message));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4 flex items-center">
        <FaServer className="mr-2 text-blue-500" />
        Prueba de Conexión
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="border rounded-lg p-4">
          <h3 className="font-medium mb-2">Estado del Servidor</h3>
          <div className="flex items-center">
            {serverStatus === 'online' && (
              <div className="flex items-center text-green-600">
                <FaCheck className="mr-1" /> Conectado
              </div>
            )}
            {serverStatus === 'offline' && (
              <div className="flex items-center text-red-600">
                <FaTimes className="mr-1" /> Desconectado
              </div>
            )}
            {serverStatus === null && (
              <div className="text-gray-500">No verificado</div>
            )}
          </div>
          {apiVersion && (
            <div className="mt-2 text-sm text-gray-600">
              Versión API: {apiVersion}
            </div>
          )}
        </div>
        
        <div className="border rounded-lg p-4">
          <h3 className="font-medium mb-2">Últimos Resultados</h3>
          {error ? (
            <div className="text-red-600 text-sm">
              Error: {error}
            </div>
          ) : (
            <div className="text-gray-600 text-sm">
              {serverStatus ? (
                serverStatus === 'online' ? 
                  'La conexión con el servidor está funcionando correctamente.' : 
                  'No se pudo establecer conexión con el servidor.'
              ) : (
                'Haga clic en "Probar Conexión" para verificar.'
              )}
            </div>
          )}
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
        <button
          onClick={testConnection}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
        >
          {isLoading ? <FaSync className="animate-spin mr-2" /> : <FaServer className="mr-2" />}
          Probar Conexión
        </button>
        
        <button
          onClick={testAuth}
          disabled={isLoading}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center"
        >
          {isLoading ? <FaSync className="animate-spin mr-2" /> : <FaCheck className="mr-2" />}
          Probar Autenticación
        </button>
      </div>
      
      <div className="mt-4 text-sm text-gray-500">
        <p>Nota: Esta herramienta es solo para desarrollo y pruebas. No usar en producción.</p>
      </div>
    </div>
  );
};

export default ConnectionTest;
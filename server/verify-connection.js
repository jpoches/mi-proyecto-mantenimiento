// server/verify-connection.js
const axios = require('axios');

// URL base de la API
const API_URL = 'http://localhost:8080/api';

// Función para verificar si el servidor está en línea
const checkServerStatus = async () => {
  try {
    console.log(`\nVerificando conexión al servidor en ${API_URL}...`);
    const response = await axios.get(API_URL);
    console.log('✅ Servidor en línea. Respuesta:', response.data);
    return true;
  } catch (error) {
    console.error('❌ Error al conectar con el servidor:', error.message);
    console.log('- Asegúrate de que el servidor esté en ejecución');
    console.log('- Verifica que el puerto sea correcto');
    console.log('- Comprueba que no hay problemas de red');
    return false;
  }
};

// Función para probar la autenticación
const testAuthentication = async () => {
  try {
    console.log('\nProbando autenticación con credenciales por defecto...');
    const response = await axios.post(`${API_URL}/auth/signin`, {
      username: 'admin',
      password: 'admin123'
    });
    
    console.log('✅ Autenticación exitosa');
    console.log('Token recibido:', response.data.accessToken ? 'Sí' : 'No');
    console.log('Datos del usuario:', response.data.user);
    
    return response.data.accessToken;
  } catch (error) {
    console.error('❌ Error en la autenticación:', error.message);
    if (error.response) {
      console.log('Estado HTTP:', error.response.status);
      console.log('Mensaje de error:', error.response.data.message || error.response.data);
    }
    return null;
  }
};

// Función para probar un endpoint protegido
const testProtectedEndpoint = async (token) => {
  if (!token) {
    console.log('\n❌ No se puede probar endpoint protegido sin token');
    return;
  }
  
  try {
    console.log('\nProbando acceso a endpoint protegido...');
    const response = await axios.get(`${API_URL}/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('✅ Acceso a endpoint protegido exitoso');
    console.log('Datos del usuario:', response.data);
  } catch (error) {
    console.error('❌ Error al acceder al endpoint protegido:', error.message);
    if (error.response) {
      console.log('Estado HTTP:', error.response.status);
      console.log('Mensaje de error:', error.response.data.message || error.response.data);
    }
  }
};

// Función principal para ejecutar todas las pruebas
const runTests = async () => {
  console.log('=== VERIFICACIÓN DE CONEXIÓN CLIENTE-SERVIDOR ===');
  
  const serverOnline = await checkServerStatus();
  if (!serverOnline) {
    console.log('\n❌ No se puede continuar sin conexión al servidor');
    return;
  }
  
  const token = await testAuthentication();
  await testProtectedEndpoint(token);
  
  console.log('\n=== FIN DE LA VERIFICACIÓN ===');
};

// Ejecutar las pruebas
runTests();
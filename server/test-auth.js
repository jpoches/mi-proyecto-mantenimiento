// test-auth.js
const axios = require('axios');

async function testAuth() {
  const BASE_URL = 'http://localhost:8080/api';
  
  try {
    console.log('Probando endpoint de autenticación...');
    
    // Probar login con credenciales correctas
    console.log('\n1. Login con admin/admin123:');
    try {
      const loginResponse = await axios.post(`${BASE_URL}/auth/signin`, {
        username: 'admin',
        password: 'admin123'
      });
      
      console.log('Status:', loginResponse.status);
      console.log('Respuesta:', loginResponse.data);
      
      // Si el login fue exitoso, probar el endpoint protegido
      if (loginResponse.data.accessToken) {
        console.log('\n2. Probando endpoint protegido con token:');
        try {
          const meResponse = await axios.get(`${BASE_URL}/auth/me`, {
            headers: {
              'Authorization': `Bearer ${loginResponse.data.accessToken}`
            }
          });
          
          console.log('Status:', meResponse.status);
          console.log('Datos del usuario:', meResponse.data);
        } catch (error) {
          console.error('Error en endpoint protegido:');
          if (error.response) {
            console.log('Status:', error.response.status);
            console.log('Data:', error.response.data);
          } else {
            console.log('Error:', error.message);
          }
        }
      }
    } catch (error) {
      console.error('Error en login:');
      if (error.response) {
        console.log('Status:', error.response.status);
        console.log('Data:', error.response.data);
      } else {
        console.log('Error:', error.message);
      }
    }
    
    // Probar login con credenciales incorrectas
    console.log('\n3. Login con credenciales incorrectas:');
    try {
      const wrongResponse = await axios.post(`${BASE_URL}/auth/signin`, {
        username: 'admin',
        password: 'wrong_password'
      });
      
      console.log('Status:', wrongResponse.status);
      console.log('Respuesta:', wrongResponse.data);
    } catch (error) {
      console.log('Error esperado con credenciales incorrectas:');
      if (error.response) {
        console.log('Status:', error.response.status);
        console.log('Data:', error.response.data);
      } else {
        console.log('Error:', error.message);
      }
    }
    
  } catch (error) {
    console.error('Error general:', error.message);
  }
}

testAuth();
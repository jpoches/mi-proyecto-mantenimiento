// client/src/utils/auth-test.js
import axios from 'axios';
import { API_URL } from '../config/api';

/**
 * Utilidad para probar la autenticación desde el cliente
 * Puedes ejecutar esta función en la consola del navegador o llamarla desde un componente
 */
export async function testAuth() {
  console.log('=== Prueba de autenticación ===');
  console.log('API URL:', API_URL);
  
  try {
    console.log('\n1. Intentando realizar login con usuario admin...');
    const loginResponse = await axios.post(`${API_URL}/auth/signin`, {
      username: 'admin',
      password: 'admin123'
    });
    
    console.log('✅ Login exitoso');
    console.log('Token recibido:', loginResponse.data.accessToken ? 'Sí' : 'No');
    console.log('Datos del usuario:', loginResponse.data.user);
    
    if (loginResponse.data.accessToken) {
      console.log('\n2. Intentando acceder a un endpoint protegido con el token...');
      
      try {
        const token = loginResponse.data.accessToken;
        
        // Configurar headers con el token
        const config = {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        };
        
        const profileResponse = await axios.get(`${API_URL}/auth/me`, config);
        console.log('✅ Acceso a endpoint protegido exitoso');
        console.log('Datos del perfil:', profileResponse.data);
        
        // Guardar el token en localStorage (opcional)
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(loginResponse.data.user));
        console.log('Token guardado en localStorage');
        
        return {
          success: true,
          token,
          user: loginResponse.data.user,
          profile: profileResponse.data
        };
      } catch (error) {
        console.error('❌ Error al acceder al endpoint protegido:', error.message);
        if (error.response) {
          console.log('Status:', error.response.status);
          console.log('Data:', error.response.data);
        }
      }
    }
  } catch (error) {
    console.error('❌ Error en login:', error.message);
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Data:', error.response.data);
    }
    
    console.log('\nPosibles soluciones:');
    console.log('1. Verifica que el servidor esté en ejecución');
    console.log('2. Verifica que las credenciales sean correctas');
    console.log('3. Verifica la URL de la API:', API_URL);
    console.log('4. Verifica los headers CORS en el servidor');
  }
  
  return { success: false };
}

// Función para depurar problemas de autenticación
export function debugAuthIssues() {
  console.log('=== Depuración de Problemas de Autenticación ===');
  
  // Verificar token almacenado
  const token = localStorage.getItem('token');
  console.log('Token en localStorage:', token ? 'Presente' : 'No encontrado');
  
  if (token) {
    try {
      // Decodificar payload del token (no verifica firma)
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const payload = JSON.parse(window.atob(base64));
      
      console.log('Payload del token:', payload);
      
      // Verificar expiración
      const expirationDate = new Date(payload.exp * 1000);
      const now = new Date();
      console.log('Fecha de expiración:', expirationDate.toLocaleString());
      console.log('Token expirado:', expirationDate < now ? 'Sí' : 'No');
    } catch (e) {
      console.error('Error al decodificar token:', e);
      console.log('El token parece estar mal formado');
    }
  }
  
  // Verificar configuración de axios
  console.log('\nVerificando configuración de axios:');
  if (axios.defaults.baseURL) {
    console.log('BaseURL:', axios.defaults.baseURL);
  } else {
    console.log('BaseURL no configurada en axios.defaults');
  }
  
  console.log('Headers por defecto:', axios.defaults.headers.common);
  
  // Sugerencias
  console.log('\nPasos para solucionar problemas de autenticación:');
  console.log('1. Limpiar el almacenamiento local (localStorage.clear())');
  console.log('2. Verificar que el backend esté funcionando correctamente');
  console.log('3. Revisar la configuración CORS en el servidor');
  console.log('4. Verificar las rutas y controladores de autenticación');
  console.log('5. Revisar que la URL de la API sea correcta');
}

// Exportar funciones para uso en la consola
window.testAuth = testAuth;
window.debugAuthIssues = debugAuthIssues;
// client/src/services/auth.service.js
import axios from '../utils/axios';
import { toast } from 'react-toastify';
import { TOKEN_EXPIRATION_TIME } from '../config/api';

class AuthService {
  /**
   * Iniciar sesión
   * @param {string} username - Nombre de usuario
   * @param {string} password - Contraseña
   * @returns {Promise<Object>} Datos del usuario y token
   */
  async login(username, password) {
    try {
      const response = await axios.post('/auth/signin', { username, password });
      
      if (response.data.accessToken) {
        // Guardar token y datos del usuario en localStorage
        localStorage.setItem('token', response.data.accessToken);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        // Configurar axios para usar el token en solicitudes posteriores
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.accessToken}`;
        
        return response.data;
      }
      
      return null;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Registrar nuevo usuario
   * @param {Object} userData - Datos del usuario
   * @returns {Promise<Object>} Respuesta del servidor
   */
  async register(userData) {
    try {
      const response = await axios.post('/auth/signup', userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Cerrar sesión
   */
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
    
    // Limpiar otros datos del localStorage que puedan contener información sensible
    const keysToKeep = ['theme', 'language']; // Ejemplo de claves que queremos conservar
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!keysToKeep.includes(key)) {
        localStorage.removeItem(key);
      }
    }
  }

  /**
   * Obtener el usuario actual desde localStorage
   * @returns {Object|null} Usuario actual o null
   */
  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    
    try {
      return JSON.parse(userStr);
    } catch (e) {
      localStorage.removeItem('user'); // Si hay un error en el parsing, limpiar
      return null;
    }
  }

  /**
   * Verificar si el usuario está autenticado
   * @returns {boolean} True si está autenticado
   */
  isAuthenticated() {
    return !!localStorage.getItem('token');
  }

  /**
   * Obtener el token de autenticación
   * @returns {string|null} Token o null
   */
  getToken() {
    return localStorage.getItem('token');
  }

  /**
   * Verificar estado de autenticación con el servidor
   * @returns {Promise<Object>} Datos del usuario actualizados
   */
  async checkAuthStatus() {
    try {
      const token = this.getToken();
      if (!token) return null;
      
      // Configurar axios para usar el token
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Verificar token obteniendo el perfil del usuario
      const response = await axios.get('/auth/me');
      
      // Actualizar datos de usuario en localStorage para mantenerlos frescos
      if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data));
      }
      
      return response.data;
    } catch (error) {
      console.error('Error checking auth status:', error);
      // Si hay un error de autenticación, limpiar todo
      this.logout();
      return null;
    }
  }

  /**
   * Verificar si el token está expirado
   * @returns {boolean} True si el token está expirado
   */
  isTokenExpired() {
    const token = this.getToken();
    if (!token) return true;
    
    try {
      // Decodificar el token (solo la parte del payload)
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      
      const { exp } = JSON.parse(jsonPayload);
      
      // Verificar si el token ha expirado
      return Date.now() >= exp * 1000;
    } catch (error) {
      console.error('Error al verificar expiración del token:', error);
      return true;
    }
  }
  
  /**
   * Solicitar restablecimiento de contraseña
   * @param {string} email - Email del usuario
   * @returns {Promise<Object>} Respuesta del servidor
   */
  async requestPasswordReset(email) {
    try {
      const response = await axios.post('/auth/request-password-reset', { email });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Restablecer contraseña con token
   * @param {string} token - Token de recuperación
   * @param {string} newPassword - Nueva contraseña
   * @returns {Promise<Object>} Respuesta del servidor
   */
  async resetPassword(token, newPassword) {
    try {
      const response = await axios.post('/auth/reset-password', { 
        token, 
        newPassword 
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export default new AuthService();
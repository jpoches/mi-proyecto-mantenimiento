// src/utils/storage.js

/**
 * Servicio para manejar el almacenamiento local del navegador
 */

// Prefijo para las claves en localStorage para evitar conflictos
const STORAGE_PREFIX = 'alv_maint_';

// Servicio de almacenamiento local
const storageService = {
  /**
   * Guarda un valor en localStorage
   * @param {string} key - Clave para almacenar el valor
   * @param {any} value - Valor a almacenar (se convertirá a JSON)
   * @param {boolean} usePrefix - Si se debe usar el prefijo de la aplicación
   */
  set: (key, value, usePrefix = true) => {
    const storageKey = usePrefix ? `${STORAGE_PREFIX}${key}` : key;
    
    try {
      const serializedValue = JSON.stringify(value);
      localStorage.setItem(storageKey, serializedValue);
      return true;
    } catch (error) {
      console.error('Error saving to localStorage:', error);
      return false;
    }
  },

  /**
   * Obtiene un valor de localStorage
   * @param {string} key - Clave del valor a obtener
   * @param {any} defaultValue - Valor por defecto si no existe
   * @param {boolean} usePrefix - Si se debe usar el prefijo de la aplicación
   * @returns {any} El valor almacenado o el valor por defecto
   */
  get: (key, defaultValue = null, usePrefix = true) => {
    const storageKey = usePrefix ? `${STORAGE_PREFIX}${key}` : key;
    
    try {
      const serializedValue = localStorage.getItem(storageKey);
      
      if (serializedValue === null) {
        return defaultValue;
      }
      
      return JSON.parse(serializedValue);
    } catch (error) {
      console.error('Error retrieving from localStorage:', error);
      return defaultValue;
    }
  },

  /**
   * Elimina un valor de localStorage
   * @param {string} key - Clave del valor a eliminar
   * @param {boolean} usePrefix - Si se debe usar el prefijo de la aplicación
   */
  remove: (key, usePrefix = true) => {
    const storageKey = usePrefix ? `${STORAGE_PREFIX}${key}` : key;
    
    try {
      localStorage.removeItem(storageKey);
      return true;
    } catch (error) {
      console.error('Error removing from localStorage:', error);
      return false;
    }
  },

  /**
   * Verifica si existe un valor en localStorage
   * @param {string} key - Clave a verificar
   * @param {boolean} usePrefix - Si se debe usar el prefijo de la aplicación
   * @returns {boolean} True si existe, false en caso contrario
   */
  exists: (key, usePrefix = true) => {
    const storageKey = usePrefix ? `${STORAGE_PREFIX}${key}` : key;
    return localStorage.getItem(storageKey) !== null;
  },

  /**
   * Limpia todos los valores de localStorage que pertenecen a la aplicación
   */
  clearAppStorage: () => {
    try {
      Object.keys(localStorage)
        .filter(key => key.startsWith(STORAGE_PREFIX))
        .forEach(key => localStorage.removeItem(key));
      return true;
    } catch (error) {
      console.error('Error clearing app storage:', error);
      return false;
    }
  },

  /**
   * Obtiene todos los valores de localStorage que pertenecen a la aplicación
   * @returns {Object} Objeto con todos los valores almacenados
   */
  getAllAppData: () => {
    try {
      const data = {};
      
      Object.keys(localStorage)
        .filter(key => key.startsWith(STORAGE_PREFIX))
        .forEach(key => {
          const keyWithoutPrefix = key.replace(STORAGE_PREFIX, '');
          data[keyWithoutPrefix] = JSON.parse(localStorage.getItem(key));
        });
      
      return data;
    } catch (error) {
      console.error('Error getting all app data:', error);
      return {};
    }
  },
  
  /**
   * Guarda un valor en sessionStorage (se borra al cerrar el navegador)
   * @param {string} key - Clave para almacenar el valor
   * @param {any} value - Valor a almacenar
   * @param {boolean} usePrefix - Si se debe usar el prefijo de la aplicación
   */
  setSession: (key, value, usePrefix = true) => {
    const storageKey = usePrefix ? `${STORAGE_PREFIX}${key}` : key;
    
    try {
      const serializedValue = JSON.stringify(value);
      sessionStorage.setItem(storageKey, serializedValue);
      return true;
    } catch (error) {
      console.error('Error saving to sessionStorage:', error);
      return false;
    }
  },
  
  /**
   * Obtiene un valor de sessionStorage
   * @param {string} key - Clave del valor a obtener
   * @param {any} defaultValue - Valor por defecto si no existe
   * @param {boolean} usePrefix - Si se debe usar el prefijo de la aplicación
   * @returns {any} El valor almacenado o el valor por defecto
   */
  getSession: (key, defaultValue = null, usePrefix = true) => {
    const storageKey = usePrefix ? `${STORAGE_PREFIX}${key}` : key;
    
    try {
      const serializedValue = sessionStorage.getItem(storageKey);
      
      if (serializedValue === null) {
        return defaultValue;
      }
      
      return JSON.parse(serializedValue);
    } catch (error) {
      console.error('Error retrieving from sessionStorage:', error);
      return defaultValue;
    }
  },
  
  /**
   * Elimina un valor de sessionStorage
   * @param {string} key - Clave del valor a eliminar
   * @param {boolean} usePrefix - Si se debe usar el prefijo de la aplicación
   */
  removeSession: (key, usePrefix = true) => {
    const storageKey = usePrefix ? `${STORAGE_PREFIX}${key}` : key;
    
    try {
      sessionStorage.removeItem(storageKey);
      return true;
    } catch (error) {
      console.error('Error removing from sessionStorage:', error);
      return false;
    }
  }
}
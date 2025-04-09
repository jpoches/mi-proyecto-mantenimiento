// server/utils/connection-test.js
/**
 * Utilidad para probar la conexión a la base de datos y la API
 * 
 * Ejecutar con: node connection-test.js
 */

const axios = require('axios');
const mysql = require('mysql2/promise');
require('dotenv').config();

// Configuración de la base de datos
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'building_maintenance',
  port: process.env.DB_PORT || 3306
};

// URL base de la API
const API_URL = 'http://localhost:8080/api';

// Prueba de conexión a la base de datos
async function testDatabaseConnection() {
  console.log('\n--- Prueba de conexión a la base de datos ---');
  console.log('Intentando conectar a la base de datos con la siguiente configuración:');
  console.log('Host:', dbConfig.host);
  console.log('Usuario:', dbConfig.user);
  console.log('Base de datos:', dbConfig.database);
  console.log('Puerto:', dbConfig.port);
  
  try {
    const connection = await mysql.createConnection({
      host: dbConfig.host,
      user: dbConfig.user,
      password: dbConfig.password,
      port: dbConfig.port
    });
    
    console.log('\n✅ Conexión a MySQL establecida correctamente');
    
    // Verificar si la base de datos existe
    const [rows] = await connection.execute(
      `SHOW DATABASES LIKE '${dbConfig.database}'`
    );
    
    if (rows.length > 0) {
      console.log(`✅ Base de datos '${dbConfig.database}' encontrada`);
      
      // Conectar a la base de datos específica
      await connection.changeUser({ database: dbConfig.database });
      
      // Verificar tablas
      const [tables] = await connection.execute('SHOW TABLES');
      console.log(`\n✅ Tablas encontradas: ${tables.length}`);
      
      if (tables.length > 0) {
        const tableList = tables.map(t => Object.values(t)[0]).join(', ');
        console.log(`Tablas: ${tableList}`);
      } else {
        console.log('⚠️ No se encontraron tablas. Es posible que necesites ejecutar las migraciones.');
      }
    } else {
      console.log(`❌ La base de datos '${dbConfig.database}' no existe`);
      console.log('Puede crear la base de datos con: CREATE DATABASE building_maintenance');
    }
    
    await connection.end();
  } catch (error) {
    console.error('❌ Error al conectar a la base de datos:', error.message);
    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.log('\nPosibles soluciones:');
      console.log('1. Verifique el usuario y contraseña');
      console.log('2. Asegúrese de que el usuario tenga permisos en la base de datos');
    }
    if (error.code === 'ECONNREFUSED') {
      console.log('\nPosibles soluciones:');
      console.log('1. Verifique que el servidor MySQL esté en ejecución');
      console.log('2. Verifique la dirección y puerto del servidor');
    }
  }
}

// Prueba del servidor API
async function testApiServer() {
  console.log('\n--- Prueba del servidor API ---');
  console.log(`Intentando conectar a: ${API_URL}`);
  
  try {
    const response = await axios.get(API_URL);
    console.log('✅ Servidor API respondiendo correctamente');
    console.log('Respuesta:', response.data);
  } catch (error) {
    console.error('❌ Error al conectar al servidor API:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\nPosibles soluciones:');
      console.log('1. Verifique que el servidor API esté en ejecución');
      console.log('2. Verifique la dirección y puerto del servidor');
      console.log('3. Ejecute: npm start en la carpeta del servidor');
    } else {
      console.log('\nDetalles adicionales del error:');
      if (error.response) {
        console.log('Status:', error.response.status);
        console.log('Data:', error.response.data);
      }
    }
  }
}

// Prueba ruta de autenticación
async function testAuthEndpoint() {
  console.log('\n--- Prueba de endpoint de autenticación ---');
  console.log(`Intentando conectar a: ${API_URL}/auth/signin`);
  
  try {
    // Intentar una autenticación con el usuario admin
    const response = await axios.post(`${API_URL}/auth/signin`, {
      username: 'admin',
      password: 'admin123'
    });
    
    console.log('✅ Endpoint de autenticación funcionando correctamente');
    console.log('Token recibido:', response.data.accessToken ? 'Sí' : 'No');
    
    // Intentar acceder a un endpoint protegido
    if (response.data.accessToken) {
      console.log('\n--- Prueba de un endpoint protegido ---');
      try {
        const protectedResponse = await axios.get(`${API_URL}/users/me`, {
          headers: {
            'Authorization': `Bearer ${response.data.accessToken}`
          }
        });
        console.log('✅ Acceso a endpoint protegido exitoso');
        console.log('Datos del usuario:', protectedResponse.data);
      } catch (error) {
        console.error('❌ Error al acceder a endpoint protegido:', error.message);
      }
    }
  } catch (error) {
    console.error('❌ Error al probar autenticación:', error.message);
    
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Data:', error.response.data);
      
      if (error.response.status === 404) {
        console.log('\nPosibles soluciones:');
        console.log('1. Verifique que las rutas de autenticación estén correctamente configuradas');
        console.log('2. Verifique que el controlador de autenticación exista y funcione correctamente');
      } else if (error.response.status === 401) {
        console.log('\nPosibles soluciones:');
        console.log('1. Verifique que las credenciales sean correctas');
        console.log('2. Asegúrese de que el usuario exista en la base de datos');
      }
    }
  }
}

// Ejecutar todas las pruebas
async function runTests() {
  console.log('=== Iniciando pruebas de conectividad para Building Maintenance System ===\n');
  await testDatabaseConnection();
  await testApiServer();
  await testAuthEndpoint();
  console.log('\n=== Pruebas completadas ===');
}

// Ejecutar las pruebas
runTests();
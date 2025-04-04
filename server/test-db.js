// server/test-db.js
const mysql = require('mysql2');

// Configuración de la conexión
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  port: 3306  // Asegúrate de que este puerto coincida con el configurado en XAMPP
});

// Intentar conectar
connection.connect(function(err) {
  if (err) {
    console.error('Error conectando a MySQL:', err);
    return;
  }
  
  console.log('Conexión a MySQL establecida exitosamente');
  
  // Intentar crear la base de datos si no existe
  connection.query('CREATE DATABASE IF NOT EXISTS building_maintenance', function(err, result) {
    if (err) {
      console.error('Error creando la base de datos:', err);
    } else {
      console.log('Base de datos creada o verificada exitosamente');
    }
    
    // Cerrar la conexión
    connection.end();
  });
});
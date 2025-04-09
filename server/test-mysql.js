const mysql = require('mysql2');

// Configuración de la conexión
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', // Cambia esto si tu MySQL tiene contraseña
  port: 3306    // Puerto estándar de MySQL
});

// Intentar conectar
connection.connect(function(err) {
  if (err) {
    console.error('Error conectando a MySQL:', err);
    console.log('\nPosibles soluciones:');
    console.log('1. Asegúrate de que MySQL esté instalado y en ejecución');
    console.log('2. Verifica que el usuario y contraseña sean correctos');
    console.log('3. Confirma que el puerto sea el correcto (3306 por defecto)');
    console.log('4. Si estás usando XAMPP o similar, asegúrate de que esté iniciado');
    return;
  }
  
  console.log('¡Conexión a MySQL establecida correctamente!');
  
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
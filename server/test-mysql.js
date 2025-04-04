const mysql = require('mysql2');

// Crear una conexión simple (probar con puerto predeterminado)
const connection = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: '',
  port: 3306  // Volver al puerto predeterminado para probar
});

// Intentar conectar
connection.connect(function(err) {
  if (err) {
    console.error('Error conectando a MySQL:', err);
    return;
  }
  
  console.log('¡Conexión a MySQL establecida correctamente!');
  connection.end();
});
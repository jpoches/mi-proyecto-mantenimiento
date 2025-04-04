const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'building_maintenance'
});

connection.connect(function(err) {
  if (err) {
    console.error('Error conectando a MySQL:', err);
    return;
  }
  
  console.log('Conexión a MySQL establecida correctamente');
  
  // Probar una consulta simple
  connection.query('SELECT 1 + 1 AS result', function(err, results) {
    if (err) {
      console.error('Error en consulta:', err);
      return;
    }
    console.log('Resultado de prueba:', results[0].result);
    connection.end();
  });
});
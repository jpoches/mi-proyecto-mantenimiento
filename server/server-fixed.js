// server/server-fixed.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mysql = require('mysql2');

dotenv.config();

// Verificar conexión a MySQL antes de iniciar
const checkMySQLConnection = () => {
  const connection = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    port: process.env.DB_PORT || 3306
  });

  return new Promise((resolve, reject) => {
    connection.connect((err) => {
      if (err) {
        console.error('Error conectando a MySQL:', err);
        reject(err);
      } else {
        console.log('Conexión a MySQL exitosa');
        connection.end();
        resolve();
      }
    });
  });
};

// Función principal para iniciar el servidor
const startServer = async () => {
  try {
    // Verificar conexión MySQL
    await checkMySQLConnection();

    const app = express();

    // Configuración CORS
   // En server-fixed.js
const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-access-token']
}));

    // Parse requests of content-type - application/json
    app.use(express.json());

    // Parse requests of content-type - application/x-www-form-urlencoded
    app.use(express.urlencoded({ extended: true }));

    // Carpeta para archivos estáticos y uploads
    app.use('/uploads', express.static('uploads'));

    const db = require("./models");

    // En desarrollo, sincronizamos la base de datos
    console.log("Intentando sincronizar la base de datos...");

    // Sincronizar tablas con { force: true }, que eliminará y recreará todas las tablas
    await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
    await db.sequelize.sync({ force: true });
    await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 1');

    console.log("Base de datos sincronizada correctamente");
    
    // Crear usuario administrador inicial
    const bcrypt = require("bcryptjs");
    await db.users.create({
      username: "admin",
      password: bcrypt.hashSync("admin123", 8),
      email: "admin@example.com",
      role: "admin"
    });

    console.log("Usuario administrador creado correctamente");

    // Rutas
    require("./routes/auth.routes")(app);
    require("./routes/user.routes")(app);
    require("./routes/client.routes")(app);
    require("./routes/servicePersonnel.routes")(app);
    require("./routes/request.routes")(app);
    require("./routes/workOrder.routes")(app);
    require("./routes/task.routes")(app);
    require("./routes/invoice.routes")(app);
    require("./routes/notification.routes")(app);
    require("./routes/calendar.routes")(app);
    require("./routes/attachment.routes")(app);
    require("./routes/dashboard.routes")(app);

    // Ruta simple para probar
    app.get("/", (req, res) => {
      res.json({ message: "Welcome to Building Maintenance System API." });
    });

    // Puerto
    const PORT = process.env.PORT || 8080;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}.`);
    });
  } catch (error) {
    console.error("Error al iniciar el servidor:", error);
    console.log("Intentando reiniciar en 5 segundos...");
    setTimeout(() => startServer(), 5000);
  }
};

// Iniciar el servidor
startServer();
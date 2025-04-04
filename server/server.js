// server/server.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

// Configuración CORS
const corsOptions = {
  origin: "http://localhost:3000"
};

app.use(cors(corsOptions));

// Parse requests of content-type - application/json
app.use(express.json());

// Parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// Carpeta para archivos estáticos y uploads
app.use('/uploads', express.static('uploads'));

const db = require("./models");

// Función para inicializar la base de datos
const initializeDatabase = async () => {
  try {
    console.log("Intentando sincronizar la base de datos...");

    // No necesitamos cerrar la conexión manualmente al inicio
    // Sequelize manejará la conexión automáticamente al sincronizar

    // Deshabilitar chequeos de claves foráneas (si usas MySQL)
    await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
    
    // Sincronizar modelos con la base de datos (force: true recrea las tablas)
    await db.sequelize.sync({ force: true });
    
    // Rehabilitar chequeos de claves foráneas
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
  } catch (err) {
    console.error("Error al sincronizar la base de datos:", err);
    process.exit(1); // Termina el proceso si falla la sincronización
  }
};

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

// Iniciar el servidor solo después de sincronizar la base de datos
const PORT = process.env.PORT || 8080;

const startServer = async () => {
  await initializeDatabase(); // Espera a que la base de datos esté lista
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
  });
};

startServer().catch(err => {
  console.error("Error al iniciar el servidor:", err);
  process.exit(1);
});
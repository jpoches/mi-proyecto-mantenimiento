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

// Función para probar la conexión a la base de datos
const testDatabaseConnection = async () => {
  try {
    await db.sequelize.authenticate();
    console.log("Conexión a la base de datos establecida correctamente.");
  } catch (error) {
    console.error("No se pudo conectar a la base de datos:", error);
    process.exit(1);
  }
};

// Función para inicializar la base de datos
const initializeDatabase = async () => {
  try {
    console.log("Intentando sincronizar la base de datos...");

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
    process.exit(1);
  }
};

// server/server.js (fragmento relevante)
// Rutas con prefijo /api
app.use('/api', require("./routes/auth.routes"));
app.use('/api', require("./routes/user.routes"));
app.use('/api', require("./routes/client.routes"));
app.use('/api', require("./routes/servicePersonnel.routes"));
app.use('/api', require("./routes/request.routes"));
app.use('/api', require("./routes/workOrder.routes"));
app.use('/api', require("./routes/task.routes"));
app.use('/api', require("./routes/invoice.routes"));
app.use('/api', require("./routes/notification.routes"));
app.use('/api', require("./routes/calendar.routes"));
app.use('/api', require("./routes/attachment.routes"));
app.use('/api', require("./routes/dashboard.routes"));
app.use('/api', require("./routes/quote.routes"));

// Ruta simple para probar
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Building Maintenance System API." });
});

// Iniciar el servidor solo después de probar la conexión y sincronizar
const PORT = process.env.PORT || 8080;

const startServer = async () => {
  await testDatabaseConnection();
  await initializeDatabase();
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
  });
};

startServer().catch(err => {
  console.error("Error al iniciar el servidor:", err);
  process.exit(1);
});
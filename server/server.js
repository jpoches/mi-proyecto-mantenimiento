// server/server.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

// Cargar variables de entorno
dotenv.config();

const app = express();

// Configuración CORS
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'x-access-token',
    'Origin',
    'Accept'
  ]
}));

// Parse requests de application/json
app.use(express.json());

// Parse requests de application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// Configuración de carpeta estática para archivos subidos
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Conexión a la base de datos
const db = require("./models");

// Función para inicializar la base de datos
const initializeDatabase = async (forceReset = false) => {
  try {
    console.log("Sincronizando la base de datos...");

    if (forceReset) {
      await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
    }
    
    await db.sequelize.sync({ force: forceReset });
    
    if (forceReset) {
      await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
      
      // Crear usuario administrador inicial
      const bcrypt = require("bcryptjs");
      await db.users.create({
        username: "admin",
        password: bcrypt.hashSync("admin123", 8),
        email: "admin@example.com",
        role: "admin"
      });
      
      console.log("Usuario administrador creado correctamente");
    }
    
    console.log("Base de datos sincronizada correctamente");
    return true;
  } catch (err) {
    console.error("Error al sincronizar la base de datos:", err);
    return false;
  }
};

// Rutas API
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/users', require('./routes/user.routes'));
app.use('/api/clients', require('./routes/client.routes'));
app.use('/api/service-personnel', require('./routes/servicePersonnel.routes'));
app.use('/api/requests', require('./routes/request.routes'));
app.use('/api/work-orders', require('./routes/workOrder.routes'));
app.use('/api/tasks', require('./routes/task.routes'));
app.use('/api/invoices', require('./routes/invoice.routes'));
app.use('/api/notifications', require('./routes/notification.routes'));
app.use('/api/calendar', require('./routes/calendar.routes'));
app.use('/api/attachments', require('./routes/attachment.routes'));
app.use('/api/dashboard', require('./routes/dashboard.routes'));
app.use('/api/quotes', require('./routes/quote.routes'));

// Ruta principal para verificar que el servidor está en funcionamiento
app.get("/api", (req, res) => {
  res.json({ 
    message: "Welcome to Building Maintenance System API.",
    version: "1.0.0",
    status: "running"
  });
});

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ message: "Ruta no encontrada" });
});

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error('Error en el servidor:', err);
  res.status(500).json({ 
    message: "Error interno del servidor",
    error: process.env.NODE_ENV === 'production' ? undefined : err.message
  });
});

// Iniciar el servidor
const PORT = process.env.PORT || 8080;

const startServer = async () => {
  // Comprobar si se pasa argumento para resetear la base de datos
  const forceReset = process.argv.includes('--reset-db');
  
  try {
    // Comprobar conexión a la base de datos
    await db.sequelize.authenticate();
    console.log("Conexión a la base de datos establecida correctamente.");
    
    // Inicializar la base de datos
    await initializeDatabase(forceReset);
    
    // Iniciar servidor
    app.listen(PORT, () => {
      console.log(`Servidor en ejecución en el puerto ${PORT}.`);
      console.log(`API accesible en http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error("Error al iniciar el servidor:", error);
    process.exit(1);
  }
};

// Iniciar la aplicación
startServer();

// Manejar el cierre del servidor
process.on('SIGINT', () => {
  console.log('Cerrando servidor...');
  process.exit(0);
});
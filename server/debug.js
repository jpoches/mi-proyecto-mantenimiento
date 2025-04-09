// server/debug.js
// Script para depurar problemas con la autenticación
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const config = require("./config/auth.config");
const db = require("./models");
const User = db.users;

async function testConnection() {
  try {
    console.log("Intentando conectar a la base de datos...");
    await db.sequelize.authenticate();
    console.log("Conexión establecida con éxito.");
    
    // Probar una consulta simple
    const count = await User.count();
    console.log(`Número total de usuarios: ${count}`);
    
    // Buscar el usuario admin
    const admin = await User.findOne({ where: { username: 'admin' } });
    
    if (admin) {
      console.log("Usuario admin encontrado:");
      console.log(`  ID: ${admin.id}`);
      console.log(`  Username: ${admin.username}`);
      console.log(`  Email: ${admin.email}`);
      console.log(`  Role: ${admin.role}`);
      
      // Probar la contraseña (admin123)
      const passwordIsValid = bcrypt.compareSync("admin123", admin.password);
      console.log(`  Contraseña 'admin123' válida: ${passwordIsValid}`);
      
      if (!passwordIsValid) {
        // Si la contraseña no es válida, actualizar la contraseña
        console.log("Actualizando contraseña del usuario admin...");
        admin.password = bcrypt.hashSync("admin123", 8);
        await admin.save();
        console.log("Contraseña actualizada.");
      }
      
      // Generar un token de prueba
      const token = jwt.sign({ id: admin.id }, config.secret, {
        expiresIn: config.jwtExpiration
      });
      console.log(`  Token generado: ${token}`);
    } else {
      console.log("Usuario admin no encontrado. Creando...");
      const adminUser = await User.create({
        username: "admin",
        email: "admin@example.com",
        password: bcrypt.hashSync("admin123", 8),
        role: "admin"
      });
      console.log(`Usuario admin creado con ID: ${adminUser.id}`);
    }
  } catch (error) {
    console.error("Error durante la prueba:", error);
  } finally {
    // Cerrar la conexión
    await db.sequelize.close();
    console.log("Conexión cerrada.");
  }
}

// Ejecutar la prueba
testConnection();
// server/test-login.js
const bcrypt = require("bcryptjs");
const db = require("./models");
const User = db.users;

async function testLogin() {
  try {
    console.log("Conectando a la base de datos...");
    await db.sequelize.authenticate();
    console.log("Conexión establecida correctamente.");

    // Buscar el usuario admin
    console.log("Buscando usuario admin...");
    const user = await User.findOne({
      where: { username: 'admin' }
    });

    if (!user) {
      console.log("Usuario admin no encontrado.");
      return;
    }

    console.log("Usuario admin encontrado:");
    console.log(`  ID: ${user.id}`);
    console.log(`  Username: ${user.username}`);
    console.log(`  Email: ${user.email}`);
    console.log(`  Rol: ${user.role}`);

    // Probar contraseña
    console.log("\nProbando contraseña 'admin123'...");
    const passwordIsValid = bcrypt.compareSync("admin123", user.password);
    console.log(`Contraseña válida: ${passwordIsValid}`);

    if (!passwordIsValid) {
      console.log("\nActualizando contraseña...");
      user.password = bcrypt.hashSync("admin123", 8);
      await user.save();
      console.log("Contraseña actualizada a 'admin123'");
    }

    // Simular el proceso de login
    console.log("\nSimulando proceso de login para 'admin'...");
    
    const userData = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role
    };

    console.log("Datos de usuario que se enviarían al cliente:");
    console.log(userData);

    console.log("\nNota: Si todo lo anterior funcionó correctamente, el problema podría estar en:");
    console.log("1. Cómo se están definiendo las rutas en auth.routes.js");
    console.log("2. El manejo de errores en el controlador");
    console.log("3. Problemas de CORS o headers en las peticiones");
    
  } catch (error) {
    console.error("Error durante la prueba:", error);
  } finally {
    await db.sequelize.close();
    console.log("\nPrueba completada y conexión cerrada.");
  }
}

testLogin();
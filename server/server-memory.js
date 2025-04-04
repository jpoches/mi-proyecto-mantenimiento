// server/server-memory.js
const express = require("express");
const cors = require("cors");
const { Sequelize, DataTypes } = require("sequelize");
const bcrypt = require("bcryptjs");

const app = express();

// Configuración CORS
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

// Base de datos en memoria
const sequelize = new Sequelize('sqlite::memory:', {
  logging: console.log
});

// Definir modelos básicos
const User = sequelize.define('user', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'client'
  }
});

// Ruta de autenticación
app.post('/api/auth/signin', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    const user = await User.findOne({ where: { username } });
    
    if (!user) {
      return res.status(404).send({ message: "Usuario no encontrado" });
    }
    
    const passwordIsValid = bcrypt.compareSync(password, user.password);
    
    if (!passwordIsValid) {
      return res.status(401).send({ message: "Contraseña inválida" });
    }
    
    // Token simple para pruebas
    const token = "test-token-" + Date.now();
    
    res.status(200).send({
      accessToken: token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Error en el servidor" });
  }
});

// Ruta de registro
app.post('/api/auth/signup', async (req, res) => {
  try {
    await User.create({
      username: req.body.username,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8),
      role: req.body.role || 'client'
    });
    
    res.status(200).send({ message: "Usuario registrado exitosamente" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Error en el servidor" });
  }
});

// Rutas para pruebas
app.get('/', (req, res) => {
  res.json({ message: "API funcionando correctamente" });
});

// Iniciar la base de datos y el servidor
async function initServer() {
  try {
    // Sincronizar la base de datos
    await sequelize.sync({ force: true });
    console.log("Base de datos inicializada");
    
    // Crear usuario admin
    await User.create({
      username: "admin",
      email: "admin@example.com",
      password: bcrypt.hashSync("admin123", 8),
      role: "admin"
    });
    console.log("Usuario admin creado");
    
    // Iniciar el servidor
    const PORT = process.env.PORT || 8080;
    app.listen(PORT, () => {
      console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Error iniciando el servidor:", error);
  }
}

initServer();
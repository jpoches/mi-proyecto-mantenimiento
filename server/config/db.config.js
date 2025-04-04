// server/config/db.config.js
require('dotenv').config();

module.exports = {
  HOST: process.env.DB_HOST || "localhost",
  USER: process.env.DB_USER || "root",
  PASSWORD: process.env.DB_PASSWORD || "",
  DB: process.env.DB_NAME || "building_maintenance",
  dialect: "mysql",
  port: process.env.DB_PORT || 3306, 
  logging: console.log, 
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};
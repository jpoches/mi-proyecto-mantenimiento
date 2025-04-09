// server/config/auth.config.js
module.exports = {
  secret: process.env.JWT_SECRET || "building-maintenance-secret-key",
  jwtExpiration: 3600, // 1 hora
  jwtRefreshExpiration: 86400, // 24 horas
};
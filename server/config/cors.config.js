// server/config/cors.config.js
module.exports = {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type', 
      'Authorization', 
      'x-access-token',
      'Origin',
      'Accept'
    ],
    exposedHeaders: ['Content-Length', 'Content-Type']
  };
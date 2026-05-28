// src/server.js – Versión final con Socket.io + Redis
require('dotenv').config();
const http     = require('http');           // Módulo HTTP nativo de Node.js
const { Server } = require('socket.io');     // Motor de WebSockets
const app      = require('./app');          // Express configurado
const { pub, sub } = require('./redis/client'); // Conexiones Redis

// 1. Crear servidor HTTP sobre Express
// (Socket.io necesita el servidor HTTP, no Express directamente)
const servidor = http.createServer(app);

// 2. Crear instancia de Socket.io sobre el servidor HTTP
const io = new Server(servidor, {
  cors: { origin: '*' }, // En producción, restringir al dominio del frontend
  transports: ['polling', 'websocket'] // polling primero para compatibilidad con Render free
});

// 3. Iniciar las suscripciones Redis (pasa 'io' para poder emitir)
const { iniciarSuscripciones } = require('./subscribers/notificaciones');
iniciarSuscripciones(io);

// 4. Manejar conexiones WebSocket de navegadores
io.on('connection', (socket) => {
  console.log(`[WS] Cliente conectado: ${socket.id}`);

  socket.on('disconnect', () => {
    console.log(`[WS] Cliente desconectado: ${socket.id}`);
  });
});

// 5. Iniciar el servidor (servidor, no app – para que Socket.io funcione)
const PORT = process.env.PORT || 3000;
servidor.listen(PORT, () => {
  console.log('======================================================');
  console.log(`  StudySync API + WebSocket · http://localhost:${PORT}`);
  console.log(`  /api/sesiones  /auth  /api-docs`);
  console.log('======================================================');
});
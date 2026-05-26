// src/app.js
// Este archivo configura Express: middlewares, rutas y manejo de errores
require('dotenv').config();
const express = require('express');

const app = express();

// ——— MIDDLEWARES GLOBALES ——————————————————————————————————————

// express.json() permite leer el body de las peticiones POST/PUT en formato JSON
app.use(express.json());

// Middleware de logs: muestra en consola cada petición que llega
app.use((req, res, next) => {
  const timestamp = new Date().toISOString().substring(11, 19);
  console.log(`[${timestamp}] ${req.method} ${req.path}`);
  next();
});

// ——— RUTAS —————————————————————————————————————————————————————

// Ruta raíz: verifica que el servidor funciona
app.get('/', (req, res) => {
  res.json({
    mensaje: 'StudySync API funcionando',
    version: '1.0.0',
    endpoints: ['/api/sesiones', '/auth/register', '/auth/login', '/api/docs']
  });
});

// NUEVA CONEXIÓN DE RUTAS (Según paso 4.3 de la guía)
const sesionesRouter = require('./routes/sesiones');
app.use('/api/sesiones', sesionesRouter);

// La ruta /auth se comentará por ahora y se agregará formalmente en el Paso 9 (JWT)
// app.use('/auth', require('./routes/auth'));


// ——— MANEJO DE ERRORES GLOBAL ——————————————————————————————————

app.use((err, req, res, next) => {
  console.error('[ERROR]', err.message);
  res.status(err.status || 500).json({
    error: err.message || 'Error interno del servidor',
    timestamp: new Date().toISOString(),
    ruta: req.path
  });
});

module.exports = app;

 // src/routes/sesiones.js 
  // Define qué función del controlador se ejecuta para cada verbo + ruta 
  const express = require('express'); 
  const router  = express.Router(); 
  const ctrl    = require('../controllers/sesionesController'); 
   
  // GET  /api/sesiones        → listar todas 
  // GET  /api/sesiones/:id    → obtener una 
  // POST /api/sesiones        → crear nueva 
  // PUT  /api/sesiones/:id    → actualizar 
  // DELETE /api/sesiones/:id  → eliminar 
   
  router.get   ('/',    ctrl.listar); 
  router.get   ('/:id', ctrl.obtenerUna); 
  router.post  ('/',    ctrl.crear); 
  router.put   ('/:id', ctrl.actualizar); 
  router.delete('/:id', ctrl.eliminar); 
   
  module.exports = router; 
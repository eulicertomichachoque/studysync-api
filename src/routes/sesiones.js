const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/sesionesController');

router.get    ('/',    ctrl.listar);
router.get    ('/:id', ctrl.obtenerUna);
router.post   ('/',    ctrl.crear);
router.put    ('/:id', ctrl.actualizar);
router.delete ('/:id', ctrl.eliminar);

module.exports = router;
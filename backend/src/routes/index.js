// routes/index.js — junta todas las rutas de la API.
// Las rutas SOLO dicen "esta URL con este verbo la atiende esta función".
// La lógica (revisar datos, responder) vive en los controladores.
const { Router } = require('express');
const sistema = require('../controllers/sistema.controller');
const pacientesRutas = require('./pacientes.routes');

const router = Router();

router.get('/', sistema.inicio);
router.get('/ping', sistema.ping);
router.get('/falla', sistema.falla);          // falla A PROPÓSITO, para probar el error 500
router.use('/api/pacientes', pacientesRutas); // todo lo de pacientes cuelga de /api/pacientes

module.exports = router;

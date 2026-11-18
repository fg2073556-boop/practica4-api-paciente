// routes/pacientes.routes.js — las rutas del recurso «pacientes».
// Todas cuelgan de /api/pacientes (así se montó en routes/index.js).
const { Router } = require('express');
const controlador = require('../controllers/pacientes.controller');
const { validarId } = require('../middlewares/validarId');

const router = Router();

// GET /api/pacientes?estado=&sexo=&buscar=   → lista (con filtros opcionales)
router.get('/', controlador.listar);

// GET /api/pacientes/resumen   → totales
// ¡OJO CON EL ORDEN! Esta ruta tiene que ir ANTES de '/:id'. Express revisa las rutas de arriba
// hacia abajo: si '/:id' estuviera primero, la palabra "resumen" se tomaría como si fuera un id.
router.get('/resumen', controlador.resumen);

// GET /api/pacientes/3   → un paciente. Primero pasa por validarId (si el id es inválido, responde 400 ahí mismo).
router.get('/:id', validarId, controlador.obtener);

// POST /api/pacientes   → da de alta un paciente nuevo (el cuerpo es un JSON)
router.post('/', controlador.crear);

// DELETE /api/pacientes/3   → da de baja a un paciente y devuelve el paciente eliminado
router.delete('/:id', validarId, controlador.eliminar);

module.exports = router;

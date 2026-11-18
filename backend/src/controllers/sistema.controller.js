// controllers/sistema.controller.js — rutas "del sistema": no tocan los datos de pacientes.

// GET /  → presentación de la API
const inicio = (req, res) => {
  res.json({
    mensaje: 'API de pacientes — práctica 4 (datos de mentira, guardados en memoria)',
    rutas: [
      'GET    /ping',
      'GET    /api/pacientes?estado=&sexo=&buscar=',
      'GET    /api/pacientes/resumen',
      'GET    /api/pacientes/:id',
      'POST   /api/pacientes',
      'DELETE /api/pacientes/:id',
      'GET    /falla  (falla a propósito)',
    ],
  });
};

// GET /ping  → sirve para comprobar que el servidor está vivo
const ping = (req, res) => {
  res.json({ mensaje: 'pong' });
};

// GET /falla  → lanza un error A PROPÓSITO para comprobar que el servidor no se cae.
// Express 5 atrapa solo los errores que se lanzan dentro de una ruta y los manda al manejador
// de errores (middlewares/errores.js), que responde 500 sin enseñar detalles.
const falla = () => {
  throw new Error('Falla a propósito: este mensaje NO debe llegar al cliente');
};

module.exports = { inicio, ping, falla };

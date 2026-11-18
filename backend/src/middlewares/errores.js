// middlewares/errores.js — los dos "últimos recursos" de la app.

// 404 general: se ejecuta SOLO si ninguna ruta anterior respondió.
// (Por eso en app.js va después de las rutas.)
const rutaNoEncontrada = (req, res) => {
  res.status(404).json({ error: `Ruta no encontrada: ${req.method} ${req.path}` });
};

// Manejador de errores. Express lo reconoce como tal porque tiene CUATRO parámetros
// (error, req, res, next): si le quitas uno, deja de funcionar como manejador de errores.
// Recibe cualquier error lanzado en una ruta o middleware (también los de express.json()).
// eslint-disable-next-line no-unused-vars
const manejadorErrores = (error, req, res, next) => {
  // 1) JSON mal escrito en el cuerpo (por ejemplo, falta cerrar una llave) → culpa del cliente: 400.
  if (error.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'El cuerpo de la petición no es un JSON válido' });
  }

  // 2) Otros errores del cliente que Express ya marcó con su código 4xx (cuerpo demasiado grande, etc.).
  const codigo = error.status ?? error.statusCode;
  if (codigo >= 400 && codigo < 500) {
    return res.status(codigo).json({ error: 'La petición no se pudo procesar' });
  }

  // 3) Cualquier otro error es culpa NUESTRA → 500.
  //    El detalle real se queda en la consola del servidor (para que yo lo vea);
  //    al cliente solo le llega un mensaje general, sin rutas de archivos ni "stack".
  console.error(error);
  res.status(500).json({ error: 'Error interno del servidor' });
};

module.exports = { rutaNoEncontrada, manejadorErrores };

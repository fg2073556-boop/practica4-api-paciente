// middlewares/validarId.js — revisa el :id de la URL en UN solo lugar.
//
// Un middleware es una función que se ejecuta ANTES del controlador. Puede:
//   - responder él mismo (y ahí termina todo), o
//   - llamar a next() para dejar pasar la petición al siguiente paso.
// Los controladores que usan este middleware ya reciben el id limpio y no vuelven a revisarlo.
const validarId = (req, res, next) => {
  const texto = req.params.id;  // lo que viene en la URL, por ejemplo "3" o "abc" (siempre es texto)
  const id = Number(texto);

  // Válido = solo dígitos, que sea un número seguro y mayor que 0.
  if (!/^\d+$/.test(texto) || !Number.isSafeInteger(id) || id < 1) {
    return res.status(400).json({ error: 'El id debe ser un número entero positivo', campo: 'id' });
  }

  res.locals.id = id; // guardamos el id YA convertido a número para que lo use el controlador
  next();             // todo bien: que siga al controlador
};

module.exports = { validarId };

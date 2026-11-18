// controllers/pacientes.controller.js — decide qué responder en cada ruta de pacientes.
//
// Un controlador hace tres cosas: (1) revisa lo que mandó el cliente, (2) le pide los datos a la
// capa data/ y (3) responde. Aquí NO se toca el arreglo directamente: eso lo hace data/pacientes.data.js.
const datos = require('../data/pacientes.data');

// Valores permitidos (los usan los filtros, el resumen y el alta).
const ESTADOS = ['hospitalizado', 'ambulatorio', 'alta'];
const SEXOS = ['F', 'M'];

// Quita acentos y mayúsculas para poder comparar: "Ramírez" → "ramirez".
const normalizar = (texto) => texto.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

// ¿Es una fecha 'AAAA-MM-DD' (formato ISO 8601) que existe de verdad (no 2026-02-31), no es futura y es de 1900 en adelante?
const esFechaDeNacimientoValida = (valor) => {
  if (typeof valor !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(valor)) return false;

  const [anio, mes, dia] = valor.split('-').map(Number);
  const fecha = new Date(Date.UTC(anio, mes - 1, dia));
  // Si la fecha no existe (31 de febrero), JavaScript la "corrige" a otro día y los números ya no coinciden.
  const existe = fecha.getUTCFullYear() === anio && fecha.getUTCMonth() === mes - 1 && fecha.getUTCDate() === dia;

  const hoy = new Date().toISOString().slice(0, 10); // la fecha de hoy como 'AAAA-MM-DD'
  return existe && anio >= 1900 && valor <= hoy;     // comparar textos 'AAAA-MM-DD' equivale a comparar fechas
};

// GET /api/pacientes?estado=&sexo=&buscar=   → lista con filtros opcionales
const listar = (req, res) => {
  const { estado, sexo, buscar } = req.query;

  // Si mandan un filtro con un valor que no existe, es un error del cliente: 400 (no una lista vacía engañosa).
  if (estado !== undefined && !ESTADOS.includes(estado)) {
    return res.status(400).json({ error: `estado debe ser uno de: ${ESTADOS.join(', ')}`, campo: 'estado' });
  }
  if (sexo !== undefined && !SEXOS.includes(sexo)) {
    return res.status(400).json({ error: `sexo debe ser uno de: ${SEXOS.join(', ')}`, campo: 'sexo' });
  }
  if (buscar !== undefined && (typeof buscar !== 'string' || buscar.trim() === '')) {
    return res.status(400).json({ error: 'buscar no puede estar vacío', campo: 'buscar' });
  }

  // Se parte de TODOS los pacientes y cada filtro que venga va quitando a los que no cumplen.
  let resultado = datos.obtenerTodos();
  if (estado) resultado = resultado.filter((p) => p.estado === estado);
  if (sexo) resultado = resultado.filter((p) => p.sexo === sexo);
  if (buscar) {
    const texto = normalizar(buscar.trim());
    resultado = resultado.filter((p) => normalizar(p.nombre).includes(texto));
  }

  res.json(resultado); // 200 por defecto
};

// GET /api/pacientes/resumen   → cuántos pacientes hay en total, por estado y por sexo
const resumen = (req, res) => {
  const todos = datos.obtenerTodos();

  // Para cada valor permitido se cuenta cuántos pacientes lo tienen.
  // (Si algún día se agrega un estado nuevo a ESTADOS, el resumen lo cuenta solo.)
  const porEstado = {};
  ESTADOS.forEach((e) => { porEstado[e] = todos.filter((p) => p.estado === e).length; });
  const porSexo = {};
  SEXOS.forEach((s) => { porSexo[s] = todos.filter((p) => p.sexo === s).length; });

  res.json({ total: todos.length, por_estado: porEstado, por_sexo: porSexo });
};

// GET /api/pacientes/:id   (el id ya viene revisado por el middleware validarId)
const obtener = (req, res) => {
  const id = res.locals.id;
  const paciente = datos.buscarPorId(id);

  if (!paciente) {
    return res.status(404).json({ error: `No existe un paciente con id ${id}` });
  }
  res.json(paciente);
};

// POST /api/pacientes   → alta de un paciente
const crear = (req, res) => {
  const cuerpo = req.body;

  // RETORNO TEMPRANO: en cuanto una revisión falla se responde 400 con "return" y NO se sigue.
  // Así el resto del código solo corre cuando todo lo anterior ya está bien.
  if (cuerpo === undefined || cuerpo === null || typeof cuerpo !== 'object' || Array.isArray(cuerpo)) {
    return res.status(400).json({ error: 'Envía un objeto JSON con la cabecera Content-Type: application/json' });
  }

  const { nombre, fecha_nacimiento, sexo, telefono, estado } = cuerpo;

  if (typeof nombre !== 'string' || nombre.trim().length < 3 || nombre.trim().length > 100) {
    return res.status(400).json({ error: 'nombre es obligatorio: texto de 3 a 100 caracteres', campo: 'nombre' });
  }
  if (!esFechaDeNacimientoValida(fecha_nacimiento)) {
    return res.status(400).json({
      error: 'fecha_nacimiento es obligatoria: una fecha real en formato AAAA-MM-DD que no sea futura',
      campo: 'fecha_nacimiento',
    });
  }
  if (!SEXOS.includes(sexo)) {
    return res.status(400).json({ error: `sexo es obligatorio y debe ser uno de: ${SEXOS.join(', ')}`, campo: 'sexo' });
  }
  if (typeof telefono !== 'string' || !/^\d{10}$/.test(telefono)) {
    return res.status(400).json({ error: 'telefono es obligatorio: texto con exactamente 10 dígitos', campo: 'telefono' });
  }
  if (!ESTADOS.includes(estado)) {
    return res.status(400).json({ error: `estado es obligatorio y debe ser uno de: ${ESTADOS.join(', ')}`, campo: 'estado' });
  }

  // Todo bien. Se guarda SOLO lo que esperamos (así no se cuela ningún campo extra que manden).
  const nuevo = datos.agregar({ nombre: nombre.trim(), fecha_nacimiento, sexo, telefono, estado });

  // 201 = creado. La cabecera Location dice en qué URL se puede consultar lo que se acaba de crear.
  res.status(201).location(`/api/pacientes/${nuevo.id}`).json(nuevo);
};

// DELETE /api/pacientes/:id   → baja de un paciente; responde con el paciente que se eliminó
const eliminar = (req, res) => {
  const id = res.locals.id;
  const borrado = datos.eliminar(id);

  if (!borrado) {
    return res.status(404).json({ error: `No existe un paciente con id ${id}` });
  }
  res.json(borrado); // 200 + el paciente que se eliminó
};

module.exports = { listar, resumen, obtener, crear, eliminar };

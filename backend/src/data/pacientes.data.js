// data/pacientes.data.js — la "base de datos" de práctica: un arreglo en memoria.
//
// Si apagas o reinicias el servidor, los cambios se pierden y vuelven los 6 pacientes de abajo.
// Todos los pacientes son FICTICIOS: no hay datos reales de ninguna clínica.
//
// Esta capa es la ÚNICA que toca el arreglo. Los controladores le piden las cosas con las
// funciones de abajo (obtenerTodos, buscarPorId, agregar, eliminar).

const pacientes = [
  { id: 1, nombre: 'Ana Sofía Ramírez Torres',    fecha_nacimiento: '1988-03-14', sexo: 'F', telefono: '2220000001', estado: 'hospitalizado' },
  { id: 2, nombre: 'Luis Ángel Hernández Cruz',   fecha_nacimiento: '1975-11-02', sexo: 'M', telefono: '2220000002', estado: 'ambulatorio' },
  { id: 3, nombre: 'María José Pérez Soto',       fecha_nacimiento: '2001-07-23', sexo: 'F', telefono: '2220000003', estado: 'alta' },
  { id: 4, nombre: 'Carlos Eduardo Flores Mena',  fecha_nacimiento: '1962-01-30', sexo: 'M', telefono: '2220000004', estado: 'hospitalizado' },
  { id: 5, nombre: 'Daniela Guadalupe Ríos Vega', fecha_nacimiento: '1994-09-09', sexo: 'F', telefono: '2220000005', estado: 'ambulatorio' },
  { id: 6, nombre: 'Jorge Alberto Núñez Lara',    fecha_nacimiento: '1980-12-18', sexo: 'M', telefono: '2220000006', estado: 'alta' },
];

// El siguiente id que se va a repartir. Nunca se reutiliza, aunque se borre un paciente.
let siguienteId = pacientes.length + 1;

// Devuelve una copia del arreglo (así nadie lo modifica por accidente desde fuera).
const obtenerTodos = () => [...pacientes];

// Devuelve el paciente con ese id, o undefined si no existe.
const buscarPorId = (id) => pacientes.find((p) => p.id === id);

// Guarda un paciente nuevo, le asigna id y lo devuelve.
const agregar = (datos) => {
  const nuevo = { id: siguienteId, ...datos };
  siguienteId += 1;
  pacientes.push(nuevo);
  return nuevo;
};

// Quita al paciente del arreglo y lo devuelve; si no existía, devuelve undefined.
const eliminar = (id) => {
  const posicion = pacientes.findIndex((p) => p.id === id);
  if (posicion === -1) return undefined;
  const [borrado] = pacientes.splice(posicion, 1); // splice quita 1 elemento y lo devuelve en un arreglo
  return borrado;
};

module.exports = { obtenerTodos, buscarPorId, agregar, eliminar };

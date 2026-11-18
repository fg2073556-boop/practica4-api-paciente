// app.js — arma la aplicación Express: qué middlewares usa y en qué ORDEN.
// Express prueba cada "app.use" de arriba hacia abajo, así que el orden importa:
// el 404 y el manejador de errores van SIEMPRE al final.
const express = require('express');
const rutas = require('./routes');
const { rutaNoEncontrada, manejadorErrores } = require('./middlewares/errores');

const app = express();

app.disable('x-powered-by'); // no avisar a todo el mundo que usamos Express
app.use(express.json());     // 1) convierte el JSON que llega en el cuerpo en el objeto req.body
app.use(rutas);              // 2) todas las rutas de la API
app.use(rutaNoEncontrada);   // 3) si ninguna ruta respondió → 404 general
app.use(manejadorErrores);   // 4) si algo lanzó un error → respuesta JSON controlada

module.exports = app;

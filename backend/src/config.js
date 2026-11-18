// config.js — lee la configuración del servidor en UN solo lugar.
//
// dotenv busca un archivo ".env" y copia sus variables a process.env.
// Si el archivo no existe (por ejemplo, al clonar el repositorio por primera vez), no pasa nada:
// se usa el valor por defecto de abajo y el servidor arranca igual.
require('dotenv').config({ quiet: true });

// process.env siempre trae TEXTO, por eso se convierte con Number().
// Si PORT no existe (o no es un número), Number(...) da 0 o NaN, que cuentan como "falso" y se usa 3000.
const PORT = Number(process.env.PORT) || 3000;

module.exports = { PORT };

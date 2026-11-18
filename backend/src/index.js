// index.js — punto de entrada: SOLO enciende el servidor.
// La aplicación en sí está en app.js. Se separan para poder probar la app sin ocupar un puerto.
const app = require('./app');
const { PORT } = require('./config');

app.listen(PORT, (error) => {
  if (error) {
    // Pasa, por ejemplo, si otro programa ya está usando ese puerto.
    console.error('No se pudo iniciar el servidor:', error.message);
    process.exit(1);
  }
  console.log(`Servidor listo en http://localhost:${PORT}`);
});

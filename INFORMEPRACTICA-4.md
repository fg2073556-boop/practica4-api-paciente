# Informe técnico — Práctica 4: programación del lado del servidor

| | |
|---|---|
| **Alumno** | Fernando González Méndez |
| **Materia** | Programación Web (AEB-1055) · Grupo CF65A · ITST |
| **Práctica** | 4 — Ejercicios de programación del lado del servidor |
| **Fecha** | ✍️ [escribe la fecha de entrega] |
| **Repositorio** | ✍️ [pega aquí el enlace del repositorio público] |

> **BORRADOR PARA COMPLETAR — borra este recuadro al terminar.**
> Las secciones ya traen los datos técnicos de la práctica (compáralos con tu código). Lo que falta es tuyo:
> busca con Ctrl+F los símbolos **✍️** (escribe con tus palabras) y **📸** (pon una captura tuya), haz lo que piden y
> **borra esas líneas**. Ningún ✍️ ni 📸 debe quedar en la entrega.
> Estas siete secciones son una propuesta: si el enunciado de la práctica pide otras siete, renómbralas y reacomódalas.

## 1. Objetivo y recurso elegido

Construir con Node.js y Express una API REST del recurso **pacientes**, organizada por capas, con rutas de lectura (lista con filtros, resumen y consulta por id), alta con validación, baja, manejo de errores y un archivo de pruebas `.http`. Los datos son ficticios y viven en memoria.

✍️ **Con tus palabras (2 o 3 líneas):** ¿por qué elegiste «pacientes» como recurso y cómo se relaciona con tu proyecto del expediente clínico?

## 2. Entorno y cómo ejecutarlo

- Node.js ✍️ [escribe tu versión: `node -v`] · npm ✍️ [`npm -v`] · Express 5 · dotenv 18.
- Pasos desde cero: `cd backend` → `npm install` → `npm run dev`. El puerto se lee de `PORT` en `.env` (por defecto 3000).
- El archivo `.env` no se sube a GitHub; el repositorio incluye `.env.example`.

📸 **Evidencia:** captura de tu terminal con `npm install` terminado y `npm run dev` mostrando «Servidor listo en http://localhost:3000».

## 3. Estructura por capas

| Archivo | Responsabilidad |
|---|---|
| `src/index.js` | Enciende el servidor en el puerto de `config.js` |
| `src/app.js` | Arma Express: lee JSON, monta las rutas y, al final, el 404 y el manejador de errores |
| `src/config.js` | Lee `PORT` del `.env` (3000 si no existe) |
| `src/routes/` | Dicen qué URL y verbo atiende cada controlador (sin lógica) |
| `src/controllers/` | Revisan lo que llega y responden con el código correcto |
| `src/middlewares/` | `validarId` (revisa el `:id` en un solo lugar) y `errores` (404 general y manejador de 4 parámetros) |
| `src/data/` | El arreglo en memoria y las funciones para leerlo y cambiarlo |

✍️ **Con tus palabras:** ¿qué ventaja tiene separar rutas, controladores y datos? *(Pista: ¿qué archivos cambiarías si mañana los datos vinieran de PostgreSQL en vez de un arreglo?)*

## 4. Rutas implementadas

| Método | Ruta | Éxito | Errores |
|---|---|---|---|
| GET | `/` y `/ping` | 200 | — |
| GET | `/api/pacientes?estado=&sexo=&buscar=` | 200 | 400 filtro con valor no permitido |
| GET | `/api/pacientes/resumen` | 200 | — |
| GET | `/api/pacientes/:id` | 200 | 400 id inválido · 404 no existe |
| POST | `/api/pacientes` | 201 + `Location` | 400 datos inválidos o JSON roto |
| DELETE | `/api/pacientes/:id` | 200 (devuelve el eliminado) | 400 · 404 |
| GET | `/falla` | — | 500 |

📸 **Evidencia:** una captura de REST Client por cada fila de la tabla (la respuesta con su código de estado).

## 5. Validación y manejo de errores

- **Alta (POST):** se revisan `nombre`, `fecha_nacimiento` (ISO 8601 real y no futura), `sexo`, `telefono` y `estado`, en ese orden. Al primer error se responde 400 con `return` y no se sigue (retorno temprano).
- **404 general:** responde a cualquier ruta que no existe.
- **Manejador de errores de cuatro parámetros** `(error, req, res, next)`: convierte el JSON roto en 400 y cualquier otra falla en 500 con un mensaje general.
- **Ruta que falla a propósito:** `GET /falla`, para comprobar que el servidor no se cae.

✍️ **Con tus palabras:** ¿por qué `/resumen` va antes de `/:id`? **Pruébalo:** cambia el orden de esas dos líneas en `pacientes.routes.js`, pide `/api/pacientes/resumen` y cuenta qué respondió y por qué. Después regrésalas a su lugar.

✍️ **Con tus palabras:** ¿por qué el error 500 no muestra el mensaje real al cliente, y dónde sí se puede ver?

## 6. Pruebas realizadas

El archivo `requests/api.http` tiene 27 peticiones: éxito y error para cada ruta, incluidas una con JSON roto y otra con un id que no existe.

✍️ **Completa con lo que viste tú:**

| Ruta | Éxito (código que obtuve) | Error (código que obtuve) |
|---|---|---|
| Lista con filtros | ✍️ | ✍️ |
| Resumen | ✍️ | — |
| Por id | ✍️ | ✍️ |
| Alta | ✍️ | ✍️ |
| Baja | ✍️ | ✍️ |
| Error 500 | — | ✍️ |

## 7. Decisiones, problemas y conclusiones

✍️ **Decisión 1 — datos en un arreglo.** ¿Por qué se guardan en memoria y no en una base de datos? ¿Qué desventaja tiene?

✍️ **Decisión 2 — filtros inválidos.** Si piden `?estado=volando`, la API responde 400 y no una lista vacía. ¿Por qué elegiste eso?

✍️ **Decisión 3 — DELETE.** ¿Por qué `DELETE` devuelve el paciente eliminado? ¿Por qué en tu proyecto real de la clínica no existe un DELETE de pacientes?

✍️ **Un problema que tuviste** al hacer la práctica y cómo lo resolviste.

✍️ **Qué aprendiste** (3 o 4 líneas).

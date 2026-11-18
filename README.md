# API de pacientes — Práctica 4 (Programación Web)

Backend en **Node.js + Express** del recurso **pacientes**, parte del proyecto integrador «Expediente clínico digital».

- Los datos son **ficticios** y se guardan **en memoria** (un arreglo): al apagar el servidor se pierden y vuelven los 6 pacientes de ejemplo.
- Estructura **por capas**: rutas → controladores → datos, con middlewares para validar el id y manejar errores.
- Autor: Fernando González Méndez · Programación Web (AEB-1055) · ITST.

## Requisitos

- Node.js 18.11 o más nuevo (recomendado 20 o superior) y npm.

## Cómo ejecutarlo desde cero

```bash
cd backend
npm install
npm run dev
```

El servidor queda en <http://localhost:3000>. Para comprobarlo abre <http://localhost:3000/ping>: debe responder `{"mensaje":"pong"}`.

**Cambiar el puerto (opcional).** El puerto se lee de la variable `PORT` del archivo `.env`. Copia el ejemplo y cambia el número:

```bash
# Windows (CMD o PowerShell)
copy .env.example .env
# Linux / macOS
cp .env.example .env
```

El archivo `.env` **no se sube a GitHub** (está en `.gitignore`). Si no existe, el servidor usa el puerto 3000.

Otros comandos: `npm start` (sin recarga automática).

## Estructura

```
.
├── README.md
├── INFORMEPRACTICA-4.md        ← informe técnico
├── requests/
│   └── api.http                ← 27 peticiones de prueba (extensión REST Client de VS Code)
└── backend/
    ├── package.json
    ├── .env.example            ← ejemplo de variables (el .env real no se sube)
    ├── .gitignore
    └── src/
        ├── index.js            ← enciende el servidor
        ├── app.js              ← arma Express: middlewares, rutas, 404 y errores
        ├── config.js           ← lee PORT del .env
        ├── routes/             ← qué URL va a qué controlador
        │   ├── index.js
        │   └── pacientes.routes.js
        ├── controllers/        ← revisan lo que llega y responden
        │   ├── sistema.controller.js
        │   └── pacientes.controller.js
        ├── middlewares/
        │   ├── validarId.js    ← revisa el :id en un solo lugar
        │   └── errores.js      ← 404 general y manejador de errores (4 parámetros)
        └── data/
            └── pacientes.data.js ← el arreglo en memoria y sus funciones
```

## Rutas

| Método | Ruta | Qué hace | Éxito | Errores |
|---|---|---|---|---|
| GET | `/` | Presentación de la API | 200 | — |
| GET | `/ping` | Comprueba que el servidor está vivo | 200 | — |
| GET | `/api/pacientes` | Lista de pacientes. Filtros opcionales: `estado`, `sexo`, `buscar` | 200 | 400 si un filtro trae un valor no permitido |
| GET | `/api/pacientes/resumen` | Total de pacientes y conteo por estado y por sexo | 200 | — |
| GET | `/api/pacientes/:id` | Un paciente por su id | 200 | 400 id inválido · 404 no existe |
| POST | `/api/pacientes` | Alta de un paciente (cuerpo JSON) | 201 + cabecera `Location` | 400 datos inválidos o JSON roto |
| DELETE | `/api/pacientes/:id` | Baja de un paciente; devuelve el paciente eliminado | 200 | 400 id inválido · 404 no existe |
| GET | `/falla` | Falla a propósito, para probar el error 500 | — | 500 |
| cualquier otra | — | Ruta que no existe | — | 404 |

Valores permitidos: `estado` = `hospitalizado`, `ambulatorio` o `alta` · `sexo` = `F` o `M`.

### Ejemplos

**Lista con filtros** — `GET /api/pacientes?sexo=F&estado=alta`

```json
[
  {
    "id": 3,
    "nombre": "María José Pérez Soto",
    "fecha_nacimiento": "2001-07-23",
    "sexo": "F",
    "telefono": "2220000003",
    "estado": "alta"
  }
]
```

**Búsqueda por nombre** (no importan acentos ni mayúsculas) — `GET /api/pacientes?buscar=ramirez`

**Resumen** — `GET /api/pacientes/resumen`

```json
{
  "total": 6,
  "por_estado": { "hospitalizado": 2, "ambulatorio": 2, "alta": 2 },
  "por_sexo": { "F": 3, "M": 3 }
}
```

**Alta** — `POST /api/pacientes` con `Content-Type: application/json`

```json
{
  "nombre": "Paciente de Prueba Uno",
  "fecha_nacimiento": "1990-05-14",
  "sexo": "F",
  "telefono": "2221234567",
  "estado": "ambulatorio"
}
```

Responde `201 Created`, con la cabecera `Location: /api/pacientes/7` y el paciente creado (con su `id`):

```json
{
  "id": 7,
  "nombre": "Paciente de Prueba Uno",
  "fecha_nacimiento": "1990-05-14",
  "sexo": "F",
  "telefono": "2221234567",
  "estado": "ambulatorio"
}
```

### Reglas de validación del alta

| Campo | Regla |
|---|---|
| `nombre` | texto de 3 a 100 caracteres |
| `fecha_nacimiento` | fecha real en formato `AAAA-MM-DD` (ISO 8601), de 1900 en adelante y no futura |
| `sexo` | `F` o `M` |
| `telefono` | texto con exactamente 10 dígitos |
| `estado` | `hospitalizado`, `ambulatorio` o `alta` |

Cada campo se revisa en ese orden y, al primer error, se responde `400` y se termina (retorno temprano).

### Formato de los errores

Todos los errores usan la misma forma: un `error` con el mensaje y, cuando aplica, el `campo` que falló.

```json
{ "error": "sexo es obligatorio y debe ser uno de: F, M", "campo": "sexo" }
```

| Código | Cuándo |
|---|---|
| 400 | Dato inválido (id, filtro, campo del alta) o JSON mal escrito |
| 404 | El paciente no existe, o la ruta no existe |
| 500 | Falla interna. Siempre responde `{ "error": "Error interno del servidor" }`; el detalle real solo se escribe en la consola del servidor |

## Cómo probar

1. En VS Code instala la extensión **REST Client** (`humao.rest-client`).
2. Enciende el servidor (`npm run dev` dentro de `backend/`).
3. Abre `requests/api.http` y haz clic en **Send Request** sobre cada petición. Cada una indica el código que se espera.

## Nota

En el proyecto real del expediente clínico los datos clínicos **no se borran** (NOM-004): aquí `DELETE` existe solo para practicar con datos de mentira.

# 🚀 Backend - TucuGym API

**Backend del sistema de gestión de gimnasio TucuGym** - API RESTful desarrollada en Node.js con Express y MongoDB.

## 📋 Descripción

API completa para la gestión de un gimnasio que maneja usuarios, planes, clases, reservas y pagos. Desarrollada con arquitectura MVC y autenticación JWT.

## 🛠️ Tecnologías Utilizadas

- **Node.js** - Entorno de ejecución JavaScript
- **Express.js** - Framework web para APIs
- **MongoDB** - Base de datos NoSQL
- **Mongoose** - ODM para MongoDB
- **JWT** - Autenticación con tokens
- **Argon2** - Encriptación de contraseñas
- **CORS** - Cross-Origin Resource Sharing
- **Dotenv** - Variables de entorno

## 📁 Estructura del Proyecto

```
back-gym/
├── src/
│   ├── controllers/     # Controladores de la API
│   │   ├── clases.controllers.js
│   │   ├── usuarios.controllers.js
│   │   ├── reserva.controllers.js
│   │   └── pagos.controllers.js
│   ├── models/          # Modelos de MongoDB
│   │   ├── clases.model.js
│   │   ├── usuarios.model.js
│   │   ├── planContratado.model.js
│   │   └── reserva.model.js
│   ├── routes/          # Rutas de la API
│   │   ├── index.routes.js
│   │   ├── clases.routes.js
│   │   ├── usuarios.routes.js
│   │   ├── reserva.routes.js
│   │   ├── admin.routes.js
│   │   └── pagos.routes.js
│   ├── services/        # Lógica de negocio
│   │   ├── clases.services.js
│   │   ├── usuarios.services.js
│   │   ├── reserva.services.js
│   │   └── pagos.services.js
│   ├── middlewares/     # Middlewares personalizados
│   │   └── auth.js
│   ├── db/              # Configuración de base de datos
│   │   └── config.db.js
│   └── index.js         # Punto de entrada
├── package.json
└── README.md
```

## 🚀 Instalación y Configuración

### Prerrequisitos

- Node.js (versión 16 o superior)
- MongoDB (local o Atlas)
- Cuenta de MercadoPago (para pagos)

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar variables de entorno

Crear archivo `.env`:

```env
PORT=3005
MONGO_URI=mongodb://localhost:27017/tucugym
JWT_SECRET=mi_clave_super_secreta_123
MERCADOPAGO_ACCESS_TOKEN=TEST-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
OPENWEATHER_API_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 3. Ejecutar el servidor

```bash
# Desarrollo
npm run dev

# Producción
npm start
```

## 🔌 Endpoints de la API

### Autenticación

- `POST /api/auth/registro` - Registro de usuarios
- `POST /api/auth/login` - Login de usuarios

### Usuarios

- `GET /api/usuarios` - Obtener todos los usuarios (admin)
- `GET /api/usuarios/:id` - Obtener usuario por ID
- `PUT /api/usuarios/:id` - Actualizar usuario
- `DELETE /api/usuarios/:id` - Eliminar usuario
- `GET /api/usuarios/:id/plan-activo` - Verificar plan activo
- `POST /api/usuarios/:id/asignar-plan` - Asignar plan a usuario

### Clases

- `GET /api/clases` - Obtener todas las clases
- `POST /api/clases` - Crear nueva clase
- `PUT /api/clases/:id` - Actualizar clase
- `DELETE /api/clases/:id` - Eliminar clase

### Reservas

- `GET /api/reservar` - Obtener reservas del usuario
- `POST /api/reservar` - Crear nueva reserva
- `DELETE /api/reservar/:id` - Cancelar reserva
- `GET /api/reservar/usuario/:idUsuario` - Obtener reservas de usuario específico

### Admin

- `GET /api/admin/todas-las-reservas` - Obtener todas las reservas activas

### Pagos

- `POST /api/pagos/crear-preferencia` - Crear preferencia de MercadoPago

## 🔐 Autenticación y Autorización

### JWT Tokens

- Los tokens se generan al hacer login
- Expiración configurable
- Middleware `auth.js` para proteger rutas

### Roles de Usuario

- **Usuario común**: Acceso a reservas y planes
- **Admin**: Acceso completo a todas las funcionalidades

## 📊 Modelos de Datos

### Usuario

```javascript
{
  nombre: String,
  email: String,
  contrasenia: String (encriptada),
  rol: String (usuario/admin),
  plan: String,
  activo: Boolean
}
```

### Clase

```javascript
{
  nombre: String,
  tipo: String,
  duracion: Number,
  capacidad: Number,
  activa: Boolean
}
```

### Reserva

```javascript
{
  idUsuario: ObjectId,
  idClase: ObjectId,
  fecha: Date,
  activa: Boolean
}
```

### Plan Contratado

```javascript
{
  idUsuario: ObjectId,
  plan: String,
  fechaInicio: Date,
  fechaFin: Date,
  activo: Boolean
}
```

## 🔧 Configuración de Base de Datos

### MongoDB

- Conexión configurada en `src/db/config.db.js`
- Soporte para MongoDB local y Atlas
- Índices optimizados para consultas frecuentes

### Variables de Entorno Requeridas

| Variable                   | Descripción            | Ejemplo                                     |
| -------------------------- | ---------------------- | ------------------------------------------- |
| `PORT`                     | Puerto del servidor    | `3005`                                      |
| `MONGO_URI`                | URL de MongoDB         | `mongodb://localhost:27017/tucugym`         |
| `JWT_SECRET`               | Clave secreta JWT      | `mi_clave_super_secreta_123`                |
| `MERCADOPAGO_ACCESS_TOKEN` | Token MercadoPago      | `TEST-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx` |
| `OPENWEATHER_API_KEY`      | API Key OpenWeatherMap | `xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`          |

## 🧪 Testing

```bash
# Ejecutar tests
npm test

# Tests en modo watch
npm run test:watch
```

## 📈 Monitoreo y Logs

- Logs de errores en consola
- Validación de datos con Mongoose
- Manejo de errores centralizado
- Respuestas estandarizadas

## 🚀 Despliegue

### Railway/Heroku

```bash
# Configurar variables de entorno en la plataforma
# Deploy automático desde GitHub
```

### Docker

```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3005
CMD ["npm", "start"]
```

## 🔒 Seguridad

- **Encriptación**: Contraseñas encriptadas con Argon2
- **JWT**: Tokens seguros para autenticación
- **CORS**: Configurado para frontend específico
- **Validación**: Datos validados antes de procesar
- **Sanitización**: Entrada de datos sanitizada

## 📝 Scripts Disponibles

```json
{
  "dev": "nodemon src/index.js",
  "start": "node src/index.js",
  "test": "jest",
  "test:watch": "jest --watch"
}
```

## 🤝 Contribuciones

1. Fork el proyecto
2. Crea una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Abre un Pull Request

## 📞 Contacto

- **Desarrollador**: Francisco Díaz
- **Email**: contacto@tucugym.com
- **GitHub**: [@FranciscoADiaz](https://github.com/FranciscoADiaz)

---

⭐ Si este backend te fue útil, ¡no olvides darle una estrella en GitHub!

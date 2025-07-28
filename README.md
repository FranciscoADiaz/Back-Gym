# 🏋️‍♂️ Backend - TucuGym

Este es el servidor backend del sistema de gestión de gimnasio **TucuGym**. Aquí se gestionan usuarios, reservas de clases y productos a través de una API REST construida con Node.js, Express y MongoDB.

---

## 📚 Descripción funcional

Este backend ofrece funcionalidades como:

- Registro e inicio de sesión de usuarios.
- Gestión de cuentas (habilitar, deshabilitar, eliminar).
- Listado y administración de clases disponibles.
- Sistema de reservas con control de cupos.
- Administración de productos (crear, editar, eliminar).

---

## 🛠️ Tecnologías utilizadas

- **Node.js**: entorno de ejecución del backend.
- **Express.js**: framework minimalista para crear la API.
- **MongoDB + Mongoose**: base de datos NoSQL y ODM para esquemas.
- **JWT (JSON Web Tokens)**: autenticación de usuarios.
- **Bcrypt**: encriptación de contraseñas.
- **Dotenv**: configuración de variables de entorno.
- **Cors**: middleware para habilitar solicitudes entre dominios.
- **SweetAlert2**: para alertas en el frontend (cliente).

---

## 📁 Estructura del proyecto

```bash
Back-Gym/
├── controllers/        # Lógica de negocio
│   ├── auth.controller.js
│   ├── usuarios.controller.js
│   ├── clases.controller.js
│   └── productos.controller.js
├── helpers/            # Funciones auxiliares (axios, validaciones)
├── middlewares/        # Autenticación, roles, errores
├── models/             # Modelos de Mongoose
│   ├── Usuario.js
│   ├── Clase.js
│   └── Producto.js
├── routes/             # Endpoints de la API
│   ├── auth.routes.js
│   ├── usuarios.routes.js
│   ├── clases.routes.js
│   └── productos.routes.js
├── .env                # Variables de entorno (no subir a GitHub)
├── server.js           # Punto de entrada principal
└── package.json
```

---

## ⚙️ Instalación y ejecución

1. **Clonar el repositorio**
```bash
git clone https://github.com/FranciscoADiaz/Back-Gym.git
cd Back-Gym
```

2. **Instalar las dependencias**
```bash
npm install
```

3. **Crear archivo `.env` con las siguientes variables**
```env
PORT=5000
MONGO_URI=tu_conexion_mongodb
JWT_SECRET=clave_secreta_segura
```

4. **Iniciar el servidor**
```bash
npm run dev
```

---

## 📡 Endpoints disponibles

> 🧠 Completá esta tabla con tus rutas reales cuando lo necesites

| Método | Ruta                    | Descripción                          |
|--------|-------------------------|--------------------------------------|
| POST   | `/api/auth/register`    | Registro de usuario nuevo            |
| POST   | `/api/auth/login`       | Login de usuario y retorno de token  |
| GET    | `/api/usuarios`         | Obtener todos los usuarios (admin)   |
| PUT    | `/api/usuarios/:id`     | Editar estado o info del usuario     |
| DELETE | `/api/usuarios/:id`     | Eliminar usuario                     |
| GET    | `/api/clases`           | Listar clases disponibles            |
| POST   | `/api/clases`           | Crear nueva clase (admin)            |
| PUT    | `/api/clases/:id`       | Editar clase                         |
| DELETE | `/api/clases/:id`       | Eliminar clase                       |
| POST   | `/api/reservas`         | Reservar una clase                   |
| GET    | `/api/reservas/usuario` | Ver reservas del usuario logueado    |
| GET    | `/api/productos`        | Listar productos                     |
| POST   | `/api/productos`        | Crear producto (admin)               |
| PUT    | `/api/productos/:id`    | Editar producto                      |
| DELETE | `/api/productos/:id`    | Eliminar producto                    |

---

## 🔐 Variables de entorno

| Variable     | Uso                                               |
|--------------|---------------------------------------------------|
| `PORT`       | Puerto donde corre el servidor                   |
| `MONGO_URI`  | URL de conexión a la base de datos MongoDB Atlas |
| `JWT_SECRET` | Clave para firmar los tokens JWT                 |

---

## 🧪 Tests

Actualmente el proyecto no cuenta con pruebas automatizadas.

> En el futuro se pueden agregar usando:
> - [Jest](https://jestjs.io/)
> - [Supertest](https://github.com/visionmedia/supertest)
> - [Mocha + Chai](https://mochajs.org/)

---

## 📈 Posibles mejoras

- Validaciones con Joi.
- Documentación Swagger para endpoints.
- Manejo de errores más robusto.
- Emails automáticos (registro, reservas, etc.) con Mailgun o Nodemailer.
- Subida de imágenes con Cloudinary.
- Dockerización del proyecto.

---

## 📄 Licencia

Este proyecto está bajo la licencia MIT. Podés usarlo, modificarlo y distribuirlo libremente.

---

## 🧠 Glosario de términos

| Término       | Significado breve                                                                 |
|---------------|-------------------------------------------------------------------------------------|
| **JWT**       | Token que se usa para identificar usuarios logueados                              |
| **Middleware**| Función que se ejecuta antes de llegar a la lógica principal de una ruta          |
| **CRUD**      | Crear, Leer, Actualizar, Eliminar (operaciones básicas sobre datos)               |
| **REST API**  | Forma estándar de estructurar las rutas en una API                                |
| **.env**      | Archivo con variables sensibles como contraseñas y URLs                           |
| **bcrypt**    | Librería para encriptar contraseñas antes de guardarlas en la base de datos       |

---

📣 Si este proyecto te fue útil o querés contribuir, ¡estás más que bienvenido a hacerlo!

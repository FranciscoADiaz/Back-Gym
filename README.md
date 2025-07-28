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

## 📁 Estructura del proyect
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
├── routes/             
│   ├── auth.routes.js
│   ├── usuarios.routes.js
│   ├── clases.routes.js
│   └── productos.routes.js
├── .env                
├── server.js           
└── package.json

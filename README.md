# 🔙 TucuGym - Backend API

> Servidor RESTful desarrollado en Node.js y Express que gestiona la lógica de negocio, autenticación y pagos de TucuGym.

## 🛠️ Stack Tecnológico

* **Runtime:** Node.js
* **Framework:** Express.js
* **Base de Datos:** MongoDB (vía Mongoose ODM)
* **Seguridad:**
    * **JWT:** Manejo de sesiones y autorización.
    * **Argon2:** Hashing avanzado de contraseñas (más seguro que bcrypt).
* **Integraciones:**
    * **MercadoPago SDK:** Procesamiento de pagos y suscripciones.

## ⚙️ Configuración e Instalación

### 1. Instalar dependencias
Dentro de esta carpeta (`back-gym`), ejecuta:
npm i

### Variables de entorno
Crea un archivo .env en la raíz de back-gym con las siguientes claves. Es crucial para que el servidor arranque.

PORT=3005
MONGO_URI=mongodb+srv:
JWT_SECRET=
MERCADOPAGO_ACCESS_TOKEN=
OPENWEATHER_API_KEY=

### Iniciar Servidor
npm run dev

### Estructura de carpetas
src/
├── controllers/  # Lógica de cada endpoint (lo que hace la app)
├── models/       # Esquemas de base de datos (Mongoose)
├── routes/       # Definición de URLs (rutas)
├── middlewares/  # Protección de rutas (validar JWT)
├── helpers/      # Funciones auxiliares (validaciones)
└── database.js   # Conexión a MongoDB

### Desarrollado por: Diaz Francisco Ariel

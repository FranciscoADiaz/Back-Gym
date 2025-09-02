# 🏋️‍♂️ TucuGym - Sistema de Gestión de Gimnasio

**TucuGym** es una aplicación web completa para la gestión de un gimnasio que permite a los usuarios contratar planes mensuales, reservar clases y administrar todas las operaciones del negocio desde un panel de administración.

## 📋 Descripción del Proyecto

TucuGym es una plataforma integral que conecta usuarios con servicios de gimnasio, ofreciendo:

- **Gestión de usuarios**: Registro, login y administración de cuentas
- **Planes de membresía**: Contratación de planes mensuales con MercadoPago
- **Reserva de clases**: Sistema de reservas para Spinning, Funcional y Crossfit
- **Panel administrativo**: Control completo de usuarios, clases y reservas
- **Información del gimnasio**: Servicios, horarios y contacto

## 🛠️ Tecnologías Utilizadas

### Frontend

- **React.js** - Framework de interfaz de usuario
- **React Bootstrap** - Componentes de UI responsivos
- **Axios** - Cliente HTTP para comunicación con el backend
- **SweetAlert2** - Alertas y notificaciones
- **React Router** - Navegación entre páginas

### Backend

- **Node.js** - Entorno de ejecución
- **Express.js** - Framework web
- **MongoDB** - Base de datos NoSQL
- **Mongoose** - ODM para MongoDB
- **JWT** - Autenticación con tokens
- **Argon2** - Encriptación de contraseñas
- **MercadoPago** - Procesamiento de pagos

### APIs Externas

- **OpenWeatherMap** - Datos del clima
- **MercadoPago** - Procesamiento de pagos online

## 🚀 Funcionalidades Principales

### 👤 Para Usuarios

- ✅ Registro e inicio de sesión
- ✅ Contratación de planes mensuales (Musculación, Funcional, Completo)
- ✅ Reserva de clases grupales (Spinning, Funcional, Crossfit)
- ✅ Visualización de reservas activas
- ✅ Cancelación de reservas
- ✅ Información del clima en tiempo real

### 👨‍💼 Para Administradores

- ✅ Panel de administración completo
- ✅ Gestión de usuarios (crear, editar, eliminar, asignar planes)
- ✅ Administración de clases (CRUD completo)
- ✅ Visualización de todas las reservas activas
- ✅ Control de estados de usuarios y clases

## 📁 Estructura del Proyecto

```
Proyecto Gym/
├── front-gym/          # Aplicación React (Frontend)
│   ├── src/
│   │   ├── components/ # Componentes reutilizables
│   │   ├── pages/      # Páginas principales
│   │   ├── helpers/    # Funciones auxiliares
│   │   └── styles/     # Archivos CSS
│   └── package.json
├── back-gym/           # Servidor Node.js (Backend)
│   ├── src/
│   │   ├── controllers/ # Lógica de negocio
│   │   ├── models/      # Modelos de MongoDB
│   │   ├── routes/      # Endpoints de la API
│   │   ├── services/    # Servicios de datos
│   │   └── middlewares/ # Autenticación y validaciones
│   └── package.json
└── README.md
```

## ⚙️ Instalación y Configuración

### Prerrequisitos

- Node.js (versión 16 o superior)
- MongoDB (local o Atlas)
- Cuenta de MercadoPago (para pagos)

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/tucugym.git
cd tucugym
```

### 2. Configurar el Backend

```bash
cd back-gym
npm install
```

Crear archivo `.env`:

```env
PORT=3005
MONGO_URI=tu_conexion_mongodb
JWT_SECRET=tu_clave_secreta
MERCADOPAGO_ACCESS_TOKEN=tu_token_mercadopago
OPENWEATHER_API_KEY=tu_api_key_clima
```

### 3. Configurar el Frontend

```bash
cd ../front-gym
npm install
```

### 4. Ejecutar el proyecto

```bash
# Terminal 1 - Backend
cd back-gym
npm run dev

# Terminal 2 - Frontend
cd front-gym
npm run dev
```



## 📱 Características Técnicas

- **Responsive Design**: Interfaz adaptada a móviles, tablets y desktop
- **Dark Mode**: Tema oscuro por defecto con diseño minimalista
- **Autenticación JWT**: Sistema seguro de login/logout
- **Validaciones**: Formularios con validación en tiempo real
- **Manejo de Errores**: Interfaz amigable para errores y excepciones
- **Optimización**: Carga rápida y experiencia fluida

## 🎯 Funcionalidades Destacadas

### Sistema de Planes

- **3 tipos de planes**: Musculación, Funcional, Completo
- **Duración flexible**: 1, 3 o 6 meses
- **Pagos seguros**: Integración completa con MercadoPago
- **Gestión automática**: Activación inmediata de planes

### Gestión de Clases

- **3 tipos de clases**: Spinning, Funcional, Crossfit
- **Horarios flexibles**: Configuración de días y horarios
- **Control de capacidad**: Límite de personas por clase
- **Estado de clases**: Activa, Inactiva, Suspendida

### Panel Administrativo

- **Dashboard completo**: Vista general de reservas y usuarios
- **Gestión de usuarios**: CRUD completo con asignación de planes
- **Administración de clases**: Creación y edición de clases
- **Monitoreo en tiempo real**: Estado de reservas y usuarios

## 👥 Integrantes del Equipo

### Francisco Díaz

- **Rol**: Desarrollador Full Stack
- **Especialidad**: React, Node.js, MongoDB
- **Contribución**: Arquitectura del sistema, desarrollo frontend y backend

### Valentín

- **Rol**: Desarrollador Full Stack
- **Especialidad**: JavaScript, Express, APIs
- **Contribución**: Desarrollo backend, integración de APIs externas

## 🚀 Despliegue

### Frontend (Vercel/Netlify)

```bash
cd front-gym
npm run build
# Subir carpeta dist/ a Vercel o Netlify
```

### Backend (Railway/Heroku)

```bash
cd back-gym
# Configurar variables de entorno en la plataforma
# Deploy automático desde GitHub
```

## 📈 Próximas Mejoras

- [ ] Notificaciones push para recordatorios de clases
- [ ] Sistema de puntuación y reviews de clases
- [ ] Integración con redes sociales
- [ ] App móvil nativa (React Native)
- [ ] Sistema de fidelización y descuentos
- [ ] Reportes y analytics avanzados

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📞 Contacto

- **Email**: contacto@tucugym.com
- **GitHub**: [@FranciscoADiaz](https://github.com/FranciscoADiaz)
- **LinkedIn**: [Francisco Díaz](https://linkedin.com/in/francisco-diaz)

---

⭐ Si este proyecto te fue útil, ¡no olvides darle una estrella en GitHub!


const mongoose = require("mongoose");

// Usar la URL de MongoDB Atlas del usuario
const MONGO_URL =
  process.env.MONGO_URL ||
  "mongodb+srv://Francisco-Diaz:H1KrJorVua27EqnT@cluster0.veepr1p.mongodb.net/test?retryWrites=true&w=majority";

console.log("🔗 Intentando conectar a MongoDB...");
console.log("📋 URL de conexión:", MONGO_URL);

// Configurar opciones de conexión
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 10000, // Timeout de 10 segundos
  socketTimeoutMS: 45000,
};

mongoose
  .connect(MONGO_URL, options)
  .then(() => {
    console.log("✅ Conectado exitosamente a MongoDB Atlas");
  })
  .catch((error) => {
    console.error("❌ Error conectando a MongoDB Atlas:", error.message);
    console.error("💥 No se pudo conectar a la base de datos");
    console.log("💡 Soluciones posibles:");
    console.log("   1. Verificar la URL de conexión");
    console.log("   2. Verificar las credenciales");
    console.log("   3. Verificar la conexión a internet");
  });

// Agregar listeners para eventos de conexión
mongoose.connection.on("connected", () => {
  console.log("🔗 Mongoose conectado a MongoDB");
});

mongoose.connection.on("error", (err) => {
  console.error("❌ Error de conexión de Mongoose:", err);
});

mongoose.connection.on("disconnected", () => {
  console.log("🔌 Mongoose desconectado de MongoDB");
});

module.exports = mongoose;

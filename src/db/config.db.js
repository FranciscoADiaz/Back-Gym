const mongoose = require("mongoose");

// Aceptar tanto MONGO_URI como MONGO_URL para compatibilidad
const MONGO_URI =
  process.env.MONGO_URI ||
  process.env.MONGO_URL ||
  "mongodb://127.0.0.1:27017/test"; // fallback local seguro

mongoose.connect(MONGO_URI);

mongoose.connection.on("connected", () => {
  const { name, host } = mongoose.connection;
  if (process.env.NODE_ENV !== "test") {
    // Log breve y sin adornos para evitar ruido
    console.log(`Mongo conectado: ${name} @ ${host}`);
  }
});

mongoose.connection.on("error", (err) => {
  if (process.env.NODE_ENV !== "test") {
    console.error("❌ Error de conexión de Mongoose:", err?.message || err);
  }
});

mongoose.connection.on("disconnected", () => {
  console.log("🔌 Mongoose desconectado de MongoDB");
});

module.exports = mongoose;

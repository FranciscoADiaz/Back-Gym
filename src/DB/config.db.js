const mongoose = require("mongoose");

const MONGO_URL =
  process.env.MONGO_URL ||
  "mongodb+srv://Francisco-Diaz:H1KrJorVua27EqnT@cluster0.veepr1p.mongodb.net/test?retryWrites=true&w=majority";

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 10000,
  socketTimeoutMS: 45000,
};

mongoose
  .connect(MONGO_URL, options)
  .then(() => {
    console.log("✅ Conectado exitosamente a MongoDB Atlas");
  })
  .catch((error) => {
    console.error("❌ Error conectando a MongoDB Atlas:", error.message);
  });

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

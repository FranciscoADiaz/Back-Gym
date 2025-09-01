const mongoose = require("mongoose");

// Configuración por defecto - MongoDB Atlas (gratuito)
const MONGO_URL =
  process.env.MONGO_URL ||
  "mongodb+srv://admin:admin123@cluster0.mongodb.net/gym?retryWrites=true&w=majority";

mongoose
  .connect(MONGO_URL)
  .then(() => {
    console.log("Conexión a la base de datos exitosa");
  })
  .catch((error) => {
    console.error("Error al conectar a la base de datos:", error);
    console.log("Intentando conectar a MongoDB local...");

    // Intentar conectar a MongoDB local
    const localUrl = "mongodb://localhost:27017/gym";
    mongoose
      .connect(localUrl)
      .then(() => {
        console.log("Conexión a MongoDB local exitosa");
      })
      .catch((localError) => {
        console.error("Error al conectar a MongoDB local:", localError);
        console.log(
          "Por favor, instala MongoDB o configura una conexión válida"
        );
      });
  });
module.exports = mongoose;

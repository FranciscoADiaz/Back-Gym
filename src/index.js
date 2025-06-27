const express = require("express");
const cors = require("cors");
require("./db/config.db.js");

const morgan = require("morgan");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Rutas
app.use("/api", require("./routes/index.routes"));

// Ruta de prueba
app.get("/", (req, res) => {
  res.json({ message: "API funcionando correctamente" });
});

// Para desarrollo local
if (process.env.NODE_ENV !== 'production') {
  const puerto = process.env.PORT || 3005;
  app.listen(puerto, () => {
    console.log("Servidor funcionando en el puerto", puerto);
  });
}

// Exportar para Vercel (ESTO ES CLAVE)
module.exports = app;

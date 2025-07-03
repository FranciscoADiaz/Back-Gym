const express = require("express");
const cors = require("cors");
require("./DB/config.db.js");

const morgan = require("morgan");

const app = express();
const puerto = process.env.PORT || 3005;

// Middlewares

app.use(cors({
  origin: "https://front-gym-rho.vercel.app"
});

app.use(express.json());
app.use(morgan("dev"));

// Iniciar servidor
app.listen(puerto, () => {
console.log("Servidor funcionando en el puerto", puerto);
});

//Rutas
app.use("/api", require("./routes/index.routes"));

module.exports = app;


const express = require("express");
const cors = require("cors");
require("./db/config.db.js");

const app = express();
const puerto = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json());

// Iniciar servidor
app.listen(puerto, () => {
  console.log("Servidor funcionando en el puerto", puerto);
});

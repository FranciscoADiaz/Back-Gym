const mongoose = require("mongoose");

const ReservaSchema = new mongoose.Schema({
  idUsuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Usuarios",
    required: true,
  },
  nombreUsuario: { type: String, required: true },
  fecha: { type: Date, required: true },
  hora: { type: String, required: true },
  tipoClase: { type: String, required: true },
  estado: { type: String, default: "pendiente" },
});

module.exports = mongoose.model("Reserva", ReservaSchema);

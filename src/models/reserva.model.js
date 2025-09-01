const mongoose = require("mongoose");

const ReservaSchema = new mongoose.Schema({
  idUsuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "usuarios",
    required: true,
  },
  fecha: {
    type: String,
    required: true,
  },
  hora: {
    type: String,
    required: true,
  },
  tipoClase: {
    type: String,
    enum: ["Spinning", "Funcional", "Crossfit"],
    required: true,
  },
  profesor: {
    type: String,
    enum: ["andres", "walter", "daniela"],
    required: true,
  },
  estado: {
    type: String,
    enum: ["activa", "cancelada", "completada"],
    default: "activa",
  },
  fechaCreacion: {
    type: Date,
    default: Date.now,
  },
});

// Índice compuesto para evitar reservas duplicadas
ReservaSchema.index(
  { idUsuario: 1, fecha: 1, hora: 1, tipoClase: 1 },
  { unique: true }
);

module.exports = mongoose.model("Reserva", ReservaSchema);

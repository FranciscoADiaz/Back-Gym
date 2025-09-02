const mongoose = require("mongoose");

const ClaseSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true,
  },
  descripcion: {
    type: String,
    required: true,
    trim: true,
  },
  tipoClase: {
    type: String,
    enum: ["Spinning", "Funcional", "Crossfit"],
    required: true,
  },
  capacidad: {
    type: Number,
    required: true,
    min: 1,
    max: 50,
  },
  duracion: {
    type: Number, // en minutos
    required: true,
    min: 60,
    max: 120,
  },
  horarios: [
    {
      dia: {
        type: String,
        enum: [
          "lunes",
          "martes",
          "miercoles",
          "jueves",
          "viernes",
          "sabado",
          "domingo",
        ],
        required: true,
      },
      hora: {
        type: String,
        required: true,
      },
    },
  ],
  precio: {
    type: Number,
    required: true,
    min: 0,
  },
  estado: {
    type: String,
    enum: ["activa", "inactiva", "suspendida"],
    default: "activa",
  },
  imagen: {
    type: String,
    default: "",
  },
  fechaCreacion: {
    type: Date,
    default: Date.now,
  },
  fechaActualizacion: {
    type: Date,
    default: Date.now,
  },
});

// Middleware para actualizar fechaActualizacion
ClaseSchema.pre("save", function (next) {
  this.fechaActualizacion = Date.now();
  next();
});

// Índice para búsquedas eficientes
ClaseSchema.index({ tipoClase: 1, estado: 1 });

module.exports = mongoose.model("Clase", ClaseSchema);

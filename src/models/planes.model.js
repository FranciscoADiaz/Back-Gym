const mongoose = require("mongoose");

const PlanSchema = new mongoose.Schema({
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
  tipo: {
    type: String,
    enum: ["Musculación", "Funcional", "Completo"],
    required: true,
  },
  precio: {
    type: Number,
    required: true,
    min: 0,
  },
  duracion: {
    type: Number, // en meses
    required: true,
    min: 1,
    max: 12,
  },
  caracteristicas: [
    {
      type: String,
      trim: true,
    },
  ],
  estado: {
    type: String,
    enum: ["activo", "inactivo"],
    default: "activo",
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
PlanSchema.pre("save", function (next) {
  this.fechaActualizacion = Date.now();
  next();
});

// Índice para búsquedas eficientes
PlanSchema.index({ tipo: 1, estado: 1 });

module.exports = mongoose.model("Plan", PlanSchema);

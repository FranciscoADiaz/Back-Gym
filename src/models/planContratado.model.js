const { Schema, model } = require("mongoose");

const PlanContratadoSchema = new Schema(
  {
    idUsuario: {
      type: Schema.Types.ObjectId,
      ref: "usuarios",
      required: true,
    },
    plan: {
      type: String,
      required: true,
      enum: [
        "Musculación",
        "Clases",
        "Completo",
        "Spinning",
        "Funcional",
        "Crossfit",
      ],
    },
    duracion: {
      type: Number,
      required: true,
      enum: [1, 3, 6],
    },
    precio: {
      type: Number,
      required: true,
    },
    fechaInicio: {
      type: Date,
      default: Date.now,
    },
    fechaVencimiento: {
      type: Date,
      required: true,
    },
    estado: {
      type: String,
      enum: ["activo", "vencido", "cancelado"],
      default: "activo",
    },
    paymentId: {
      type: String,
    },
    preferenceId: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const PlanContratadoModel = model("planContratado", PlanContratadoSchema);
module.exports = PlanContratadoModel;

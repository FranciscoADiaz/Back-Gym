const { Schema, model } = require("mongoose");

const UsuariosSchema = new Schema({
  nombreUsuario: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    maxLength: [30, "Limite maximo 30 caracteres"],
    minLength: [3, "Limite minimo 3 caracteres"],
  },
  emailUsuario: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    maxLength: [50, "Limite maximo 50 caracteres"],
    minLength: [3, "Limite minimo 3 caracteres"],
  },
  contrasenia: {
    type: String,
    required: true,
    trim: true,
    maxLength: 100,
    minLength: 8,
  },
  rol: {
    type: String,
    enum: ["usuario", "admin"],
    default: "usuario",
  },
  estado: {
    type: String,
    enum: ["habilitado", "deshabilitado"],
    default: "habilitado",
  },
  fechaReg: {
    type: Date,
    default: Date.now(),
  },
  idCarrito: {
    type: String,
  },
  idFavoritos: {
    type: String,
  },
  telefono: {
    type: String,
    trim: true,
    default: "",
  },
  plan: {
    type: String,
    enum: ["Sin plan", "Musculación", "SOLO CLASES", "Completo"],
    default: "Sin plan",
  },
  fechaVencimiento: {
    type: Date,
    default: null,
  },
  passwordResetToken: {
    type: String,
    default: null,
    select: false,
  },
  passwordResetExpires: {
    type: Date,
    default: null,
    select: false,
  },
});

//toJSON
UsuariosSchema.methods.toJSON = function () {
  const { contrasenia, ...usuario } = this.toObject();
  return usuario;
};

const UsuariosModel = model("usuarios", UsuariosSchema);
module.exports = UsuariosModel;

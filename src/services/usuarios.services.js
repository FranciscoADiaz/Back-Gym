const UsuariosModel = require("../models/usuarios.model");
const argon = require("argon2");
const jwt = require("jsonwebtoken");

const registroUsuarioDb = async (body) => {
  try {
  const nuevoUsuario = new UsuariosModel(body);
  nuevoUsuario.contrasenia = await argon.hash(nuevoUsuario.contrasenia)
  await nuevoUsuario.save();

  return {
    statusCode: 201,
    msg: "Usuario registrado exitosamente",
  }
  } catch (error) {
  
    return {
      error,
      statusCode: 500
    };
  }
}

const inicioSesionUsuarioDb = async (body) => {
  try {
    const usuarioExiste = await UsuariosModel.findOne({
      nombreUsuario: body.nombreUsuario,})

      if (!usuarioExiste) {
        return {
          statusCode: 400,
          msg: "Usuario no encontrado.",
        };
      }

      if (usuarioExiste.estado === "deshabilitado") {
        return {
          statusCode: 400,
          msg: "Usuario DESHABILITADO, por favor contacte al administrador.",
        }
      }

const confirmarContrasenia = await argon.verify(usuarioExiste.contrasenia, body.contrasenia);

      if (confirmarContrasenia) {
        const payload = {
         idUsuario: usuarioExiste._id,
         nombreUsuario: usuarioExiste.nombreUsuario,
         rolUsuario: usuarioExiste.rol
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET)

        return {
          statusCode: 200,
          msg: "Inicio de sesión exitoso",
          token,
        };

      }

      else {
        return {
          statusCode: 200,
          msg: "Usuario y/o contraseña no coinciden",
          
        };
      }

  } 
  
  catch (error) {
    return {
      error,
      statusCode: 500,
    };
  }
};


const habilitarDeshabilitarUsuarioDb = async (idUsuario) => {
try {

  const usuario = await UsuariosModel.findById(idUsuario)
if (usuario.estado === "deshabilitado") {
  usuario.estado = "habilitado"
  await usuario.save()
  return {
    statusCode: 200,
    msg: "Usuario habilitado exitosamente",
  };
}
else {
  usuario.estado = "deshabilitado"
  await usuario.save() 
  return {
    statusCode: 200,
    msg: "Usuario deshabilitado exitosamente",
  };
}
}

catch (error) {
  return {
    error,
    statusCode: 500,
  };
}
}

module.exports = {
  registroUsuarioDb,
  inicioSesionUsuarioDb,
  habilitarDeshabilitarUsuarioDb
};
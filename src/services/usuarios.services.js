const UsuariosModel = require("../models/usuarios.model");
const argon = require("argon2");
const jwt = require("jsonwebtoken");

const registroUsuarioDb = async (body) => {
  try {
    const nuevoUsuario = new UsuariosModel(body);
    nuevoUsuario.contrasenia = await argon.hash(nuevoUsuario.contrasenia);
    await nuevoUsuario.save();

    /* para cuando configure nodemailer sino no me deja registrar
  const { registroExitoso } = require("../helpers/messages.helpers");
   await registroExitoso(nuevoUsuario.emailUsuario, nuevoUsuario.nombreUsuario);
   */

    return {
      statusCode: 201,
      msg: "Recibirás un correo de confirmación 💪",
    };
  } catch (error) {
    return {
      error,
      statusCode: 500,
    };
  }
};

const inicioSesionUsuarioDb = async (body) => {
  try {
    const usuarioExiste = await UsuariosModel.findOne({
      nombreUsuario: body.nombreUsuario,
    });

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
      };
    }

    const confirmarContrasenia = await argon.verify(
      usuarioExiste.contrasenia,
      body.contrasenia
    );

    if (confirmarContrasenia) {
      const payload = {
        idUsuario: usuarioExiste._id,
        nombreUsuario: usuarioExiste.nombreUsuario,
        rolUsuario: usuarioExiste.rol,
        estadoUsuario: usuarioExiste.estado,
      };

      const token = jwt.sign(payload, process.env.JWT_SECRET);

      return {
        msg: "Inicio de sesión exitoso",
        token,
        rolUsuario: usuarioExiste.rol,
        statusCode: 200,
      };
    } else {
      return {
        statusCode: 200,
        msg: "Usuario y/o contraseña no coinciden",
      };
    }
  } catch (error) {
    return {
      error,
      statusCode: 500,
    };
  }
};

const habilitarDeshabilitarUsuarioDb = async (idUsuario) => {
  try {
    const usuario = await UsuariosModel.findById(idUsuario);
    if (usuario.estado === "deshabilitado") {
      usuario.estado = "habilitado";
      await usuario.save();
      return {
        statusCode: 200,
        msg: "Usuario habilitado exitosamente",
      };
    } else {
      usuario.estado = "deshabilitado";
      await usuario.save();
      return {
        statusCode: 200,
        msg: "Usuario deshabilitado exitosamente",
      };
    }
  } catch (error) {
    return {
      error,
      statusCode: 500,
    };
  }
};

const obtenerTodosLosUsuariosDb = async () => {
  try {
    const usuarios = await UsuariosModel.find();

    return {
      usuarios,
      statusCode: 200,
    };
  } catch (error) {
    return {
      error,
      statusCode: 500,
    };
  }
};

const eliminarUsuarioDb = async (idUsuario) => {
  try {
    const usuario = await UsuariosModel.findById(idUsuario);

    if (!usuario) {
      return {
        statusCode: 404,
        msg: "Usuario no encontrado",
      };
    }

    await UsuariosModel.findByIdAndDelete(idUsuario);

    return {
      statusCode: 200,
      msg: "Usuario eliminado exitosamente",
    };
  } catch (error) {
    return {
      error,
      statusCode: 500,
      msg: "Error al eliminar el usuario",
    };
  }
};

const crearUsuarioDb = async (body) => {
  try {
    const { nombreUsuario, emailUsuario, contrasenia, rol, telefono, plan } =
      body;

    // Validar que no exista el usuario
    const usuarioExistente = await UsuariosModel.findOne({
      $or: [{ nombreUsuario }, { emailUsuario }],
    });

    if (usuarioExistente) {
      return {
        statusCode: 400,
        msg: "El usuario o email ya existe",
      };
    }

    // Crear nuevo usuario
    const nuevoUsuario = new UsuariosModel({
      nombreUsuario,
      emailUsuario,
      contrasenia: await argon.hash(contrasenia, 10),
      rol,
      telefono: telefono || "",
      plan: plan || "Sin plan",
    });

    await nuevoUsuario.save();
    return {
      statusCode: 201,
      msg: "Usuario creado exitosamente",
    };
  } catch (error) {
    return {
      error,
      statusCode: 500,
      msg: "Error interno del servidor",
    };
  }
};

const actualizarUsuarioDb = async (idUsuario, body) => {
  try {
    const { nombreUsuario, emailUsuario, contrasenia, rol, telefono, plan } =
      body;

    // Buscar usuario
    const usuario = await UsuariosModel.findById(idUsuario);
    if (!usuario) {
      return {
        statusCode: 404,
        msg: "Usuario no encontrado",
      };
    }

    // Validar que el email no esté en uso por otro usuario
    if (emailUsuario !== usuario.emailUsuario) {
      const emailEnUso = await UsuariosModel.findOne({
        emailUsuario,
        _id: { $ne: idUsuario },
      });
      if (emailEnUso) {
        return {
          statusCode: 400,
          msg: "El email ya está en uso",
        };
      }
    }

    // Actualizar campos
    usuario.nombreUsuario = nombreUsuario;
    usuario.emailUsuario = emailUsuario;
    usuario.rol = rol;
    usuario.telefono = telefono || "";
    usuario.plan = plan || "Sin plan";

    // Solo actualizar contraseña si se proporciona
    if (contrasenia && contrasenia.trim() !== "") {
      usuario.contrasenia = await argon.hash(contrasenia, 10);
    }

    await usuario.save();
    return {
      statusCode: 200,
      msg: "Usuario actualizado exitosamente",
    };
  } catch (error) {
    return {
      error,
      statusCode: 500,
      msg: "Error interno del servidor",
    };
  }
};

module.exports = {
  registroUsuarioDb,
  inicioSesionUsuarioDb,
  habilitarDeshabilitarUsuarioDb,
  obtenerTodosLosUsuariosDb,
  eliminarUsuarioDb,
  crearUsuarioDb,
  actualizarUsuarioDb,
};

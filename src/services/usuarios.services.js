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
    const { nombreUsuario, contrasenia } = body;

    // Buscar usuario
    const usuario = await UsuariosModel.findOne({ nombreUsuario });

    if (!usuario) {
      return {
        statusCode: 400,
        msg: "Usuario no encontrado",
      };
    }

    // Verificar contraseña con Argon2
    const contraseniaValida = await argon.verify(
      usuario.contrasenia,
      contrasenia
    );

    if (!contraseniaValida) {
      return {
        statusCode: 400,
        msg: "Contraseña incorrecta",
      };
    }

    // Verificar estado
    if (usuario.estado !== "habilitado") {
      return {
        statusCode: 400,
        msg: "Usuario deshabilitado",
      };
    }

    // Generar token JWT con MÁS información
    const payload = {
      idUsuario: usuario._id,
      nombreUsuario: usuario.nombreUsuario,
      emailUsuario: usuario.emailUsuario, // ← AGREGAR ESTA LÍNEA
      rolUsuario: usuario.rol,
      estadoUsuario: usuario.estado,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    return {
      success: true,
      msg: "Inicio de sesión exitoso",
      token,
      rolUsuario: usuario.rol,
      statusCode: 200,
    };
  } catch (error) {
    console.error("Error en login:", error);
    return {
      error,
      statusCode: 500,
      msg: "Error interno del servidor",
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
      contrasenia: await argon.hash(contrasenia),
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
    console.log("Datos recibidos en actualizarUsuarioDb:", { idUsuario, body });

    const { nombreUsuario, emailUsuario, contrasenia, rol, telefono, plan } =
      body;

    // Validar campos requeridos
    if (!nombreUsuario || !emailUsuario || !rol) {
      console.log("Campos requeridos faltantes");
      return {
        statusCode: 400,
        msg: "Nombre de usuario, email y rol son campos requeridos",
      };
    }

    // Buscar usuario
    const usuario = await UsuariosModel.findById(idUsuario);
    if (!usuario) {
      console.log("Usuario no encontrado:", idUsuario);
      return {
        statusCode: 404,
        msg: "Usuario no encontrado",
      };
    }

    console.log("Usuario encontrado:", usuario.nombreUsuario);

    // Validar que el email no esté en uso por otro usuario
    if (emailUsuario !== usuario.emailUsuario) {
      const emailEnUso = await UsuariosModel.findOne({
        emailUsuario,
        _id: { $ne: idUsuario },
      });
      if (emailEnUso) {
        console.log("Email ya en uso");
        return {
          statusCode: 400,
          msg: "El email ya está en uso",
        };
      }
    }

    // Validar que el nombre de usuario no esté en uso por otro usuario
    if (nombreUsuario !== usuario.nombreUsuario) {
      const nombreEnUso = await UsuariosModel.findOne({
        nombreUsuario,
        _id: { $ne: idUsuario },
      });
      if (nombreEnUso) {
        console.log("Nombre de usuario ya en uso");
        return {
          statusCode: 400,
          msg: "El nombre de usuario ya está en uso",
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
      console.log("Actualizando contraseña");
      usuario.contrasenia = await argon.hash(contrasenia);
    }

    console.log("Guardando usuario...");
    await usuario.save();
    console.log("Usuario guardado exitosamente");

    return {
      statusCode: 200,
      msg: "Usuario actualizado exitosamente",
    };
  } catch (error) {
    console.error("Error al actualizar usuario:", error);
    return {
      error: error.message,
      statusCode: 500,
      msg: "Error interno del servidor",
    };
  }
};

const obtenerUsuarioPorIdDb = async (idUsuario) => {
  try {
    const usuario = await UsuariosModel.findById(idUsuario).select(
      "-contrasenia"
    );
    if (!usuario) {
      return {
        statusCode: 404,
        msg: "Usuario no encontrado",
      };
    }
    return {
      usuario,
      statusCode: 200,
    };
  } catch (error) {
    return {
      error,
      statusCode: 500,
      msg: "Error interno del servidor",
    };
  }
};

// Función para migrar contraseñas de bcrypt a Argon2
const migrarContraseniasDb = async () => {
  try {
    const bcrypt = require("bcrypt");
    const usuarios = await UsuariosModel.find();
    let migrados = 0;

    for (const usuario of usuarios) {
      // Si la contraseña empieza con $2, es bcrypt
      if (usuario.contrasenia.startsWith("$2")) {
        console.log(
          `Migrando contraseña para usuario: ${usuario.nombreUsuario}`
        );

        // Generar una nueva contraseña temporal
        const nuevaContrasenia = "temp123456"; // Contraseña temporal
        usuario.contrasenia = await argon.hash(nuevaContrasenia);
        await usuario.save();
        migrados++;

        console.log(
          `Usuario ${usuario.nombreUsuario} migrado. Nueva contraseña temporal: ${nuevaContrasenia}`
        );
      }
    }

    return {
      statusCode: 200,
      msg: `Migración completada. ${migrados} usuarios migrados a Argon2`,
      usuariosMigrados: migrados,
    };
  } catch (error) {
    return {
      error,
      statusCode: 500,
      msg: "Error en la migración",
    };
  }
};

const asignarPlanUsuarioDb = async (idUsuario, planData) => {
  try {
    const { plan, duracion, precio } = planData;

    // Buscar usuario
    const usuario = await UsuariosModel.findById(idUsuario);
    if (!usuario) {
      return {
        statusCode: 404,
        msg: "Usuario no encontrado",
      };
    }

    // Calcular fecha de vencimiento
    const fechaVencimiento = new Date();
    fechaVencimiento.setMonth(fechaVencimiento.getMonth() + parseInt(duracion));

    // Actualizar usuario con el nuevo plan
    await UsuariosModel.findByIdAndUpdate(idUsuario, {
      plan: plan,
      fechaVencimiento: fechaVencimiento,
    });

    // Crear registro en planContratado
    const PlanContratadoModel = require("../models/planContratado.model");
    await PlanContratadoModel.create({
      idUsuario: idUsuario,
      plan: plan,
      duracion: parseInt(duracion),
      precio: precio,
      fechaInicio: new Date(),
      fechaVencimiento: fechaVencimiento,
      estado: "activo",
    });

    return {
      statusCode: 200,
      msg: `Plan ${plan} asignado exitosamente al usuario`,
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
  obtenerUsuarioPorIdDb,
  migrarContraseniasDb,
  asignarPlanUsuarioDb,
};

const UsuariosModel = require("../models/usuarios.model");
const argon = require("argon2");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const {
  registroExitoso,
  recoveryPassEmail,
} = require("../helpers/messages.helpers");

const registroUsuarioDb = async (body) => {
  try {
    const { nombreUsuario, emailUsuario, contrasenia } = body;

    // Verificar existencia previa de usuario o email para responder 409 en vez de 500
    const existente = await UsuariosModel.findOne({
      $or: [
        { nombreUsuario: (nombreUsuario || "").toLowerCase() },
        { emailUsuario: (emailUsuario || "").toLowerCase() },
      ],
    });

    if (existente) {
      return {
        statusCode: 409,
        msg: "El usuario o email ya existe",
      };
    }

    const nuevoUsuario = new UsuariosModel({
      nombreUsuario,
      emailUsuario,
      contrasenia,
    });
    nuevoUsuario.contrasenia = await argon.hash(nuevoUsuario.contrasenia);
    await nuevoUsuario.save();

    // enviar email de bienvenida (no bloquear el flujo si falla)
    try {
      await registroExitoso(
        nuevoUsuario.emailUsuario,
        nuevoUsuario.nombreUsuario
      );
    } catch (e) {
      // log opcional; continuar sin interrumpir el registro
      if (process.env.NODE_ENV !== "test") {
        console.warn("No se pudo enviar email de bienvenida:", e?.message || e);
      }
    }

    return {
      statusCode: 201,
      msg: "Recibirás un correo de confirmación 💪",
    };
  } catch (error) {
    // Duplicados de índice único (Mongo 11000)
    if (error && (error.code === 11000 || error.name === "MongoServerError")) {
      return {
        statusCode: 409,
        msg: "El usuario o email ya existe",
      };
    }

    // Errores de validación del modelo
    if (error && error.name === "ValidationError") {
      const firstMessage = Object.values(error.errors || {})[0]?.message;
      return {
        statusCode: 400,
        msg: firstMessage || "Datos inválidos",
      };
    }

    return {
      error,
      statusCode: 500,
      msg: "Error interno del servidor",
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
    return {
      error,
      statusCode: 500,
      msg: "Error interno del servidor",
    };
  }
};

const solicitarRecuperacionContraseniaDb = async (emailUsuario = "") => {
  try {
    if (!emailUsuario) {
      return {
        statusCode: 400,
        msg: "El email es requerido",
      };
    }

    const emailNormalizado = String(emailUsuario).toLowerCase().trim();
    const usuario = await UsuariosModel.findOne({ emailUsuario: emailNormalizado });

    // No revelar si el email existe o no
    if (!usuario) {
      return {
        statusCode: 200,
        msg: "Si el email existe, enviaremos un enlace para recuperar la contraseña",
      };
    }

    const tokenPlano = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(tokenPlano).digest("hex");

    usuario.passwordResetToken = tokenHash;
    usuario.passwordResetExpires = new Date(Date.now() + 30 * 60 * 1000); // 30 minutos
    await usuario.save();

    try {
      await recoveryPassEmail(usuario.emailUsuario, tokenPlano, usuario.nombreUsuario);
    } catch (errorEmail) {
      console.warn("No se pudo enviar email de recuperación:", errorEmail?.message || errorEmail);
      return {
        statusCode: 500,
        msg: "No pudimos enviar el correo en este momento. Intenta nuevamente más tarde.",
      };
    }

    return {
      statusCode: 200,
      msg: "Enviamos un correo con instrucciones para recuperar tu contraseña",
    };
  } catch (error) {
    return {
      statusCode: 500,
      msg: "Error al solicitar la recuperación de contraseña",
      error,
    };
  }
};

const restablecerContraseniaDb = async ({ token, nuevaContrasenia }) => {
  try {
    if (!token || !nuevaContrasenia) {
      return {
        statusCode: 400,
        msg: "Token y nueva contraseña son requeridos",
      };
    }

    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    const usuario = await UsuariosModel.findOne({
      passwordResetToken: tokenHash,
      passwordResetExpires: { $gt: new Date() },
    }).select("+passwordResetToken +passwordResetExpires");

    if (!usuario) {
      return {
        statusCode: 400,
        msg: "El enlace es inválido o expiró. Solicita uno nuevo.",
      };
    }

    usuario.contrasenia = await argon.hash(nuevaContrasenia);
    usuario.passwordResetToken = null;
    usuario.passwordResetExpires = null;
    await usuario.save();

    return {
      statusCode: 200,
      msg: "Tu contraseña fue actualizada correctamente",
    };
  } catch (error) {
    return {
      statusCode: 500,
      msg: "Error al restablecer la contraseña",
      error,
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

    // Verificar planes activos para cada usuario
    const PlanContratadoModel = require("../models/planContratado.model");

    const usuariosConPlanes = await Promise.all(
      usuarios.map(async (usuario) => {
        // Buscar plan activo en planContratado
        const planActivo = await PlanContratadoModel.findOne({
          idUsuario: usuario._id,
          estado: "activo",
          fechaVencimiento: { $gt: new Date() },
        }).sort({ fechaVencimiento: -1 });

        // Si tiene plan activo, usar ese plan. Si no, usar el plan del usuario o "Sin plan"
        const planUsuario = planActivo
          ? planActivo.plan
          : usuario.plan || "Sin plan";

        return {
          ...usuario.toObject(),
          plan: planUsuario,
          planActivo: !!planActivo,
          fechaVencimientoPlan: planActivo ? planActivo.fechaVencimiento : null,
        };
      })
    );

    const result = {
      usuarios: usuariosConPlanes,
      statusCode: 200,
    };
    return result;
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
    const { nombreUsuario, emailUsuario, contrasenia, rol, telefono, plan } =
      body;

    if (!nombreUsuario || !emailUsuario || !rol) {
      return {
        statusCode: 400,
        msg: "Nombre de usuario, email y rol son campos requeridos",
      };
    }

    const usuario = await UsuariosModel.findById(idUsuario);
    if (!usuario) {
      return {
        statusCode: 404,
        msg: "Usuario no encontrado",
      };
    }

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

    if (nombreUsuario !== usuario.nombreUsuario) {
      const nombreEnUso = await UsuariosModel.findOne({
        nombreUsuario,
        _id: { $ne: idUsuario },
      });
      if (nombreEnUso) {
        return {
          statusCode: 400,
          msg: "El nombre de usuario ya está en uso",
        };
      }
    }

    usuario.nombreUsuario = nombreUsuario;
    usuario.emailUsuario = emailUsuario;
    usuario.rol = rol;
    usuario.telefono = telefono || "";
    usuario.plan = plan || "Sin plan";

    if (contrasenia && contrasenia.trim() !== "") {
      usuario.contrasenia = await argon.hash(contrasenia);
    }

    await usuario.save();

    return {
      statusCode: 200,
      msg: "Usuario actualizado exitosamente",
    };
  } catch (error) {
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

    // Verificar si el usuario tiene un plan activo
    const PlanContratadoModel = require("../models/planContratado.model");
    const planActivo = await PlanContratadoModel.findOne({
      idUsuario: idUsuario,
      estado: "activo",
      fechaVencimiento: { $gt: new Date() },
    }).sort({ fechaVencimiento: -1 });

    // Si tiene plan activo, usar ese plan. Si no, usar el plan del usuario o "Sin plan"
    const planUsuario = planActivo
      ? planActivo.plan
      : usuario.plan || "Sin plan";

    return {
      usuario: {
        ...usuario.toObject(),
        plan: planUsuario,
        planActivo: !!planActivo,
        fechaVencimientoPlan: planActivo ? planActivo.fechaVencimiento : null,
      },
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



const asignarPlanUsuarioDb = async (idUsuario, planData) => {
  try {
    const { plan, duracion, precio } = planData;

    const usuario = await UsuariosModel.findById(idUsuario);
    if (!usuario) {
      return {
        statusCode: 404,
        msg: "Usuario no encontrado",
      };
    }

    // Calcular fechas
    const fechaInicio = new Date();
    const fechaVencimiento = new Date();
    fechaVencimiento.setMonth(fechaVencimiento.getMonth() + parseInt(duracion));

    // Cerrar cualquier plan activo previo del usuario en PlanContratado
    const PlanContratadoModel = require("../models/planContratado.model");
    await PlanContratadoModel.updateMany(
      {
        idUsuario,
        estado: "activo",
        fechaVencimiento: { $gt: new Date() },
      },
      { $set: { estado: "cancelado" } }
    );

    // Crear registro del nuevo plan contratado
    const nuevoPlan = new PlanContratadoModel({
      idUsuario,
      plan,
      duracion,
      precio,
      fechaInicio,
      fechaVencimiento,
      estado: "activo",
    });
    await nuevoPlan.save();

    // Sincronizar datos en el documento del usuario (guardar la instancia para garantizar persistencia)
    usuario.plan = plan;
    usuario.fechaVencimiento = fechaVencimiento;
    await usuario.save({ validateBeforeSave: true });

    return {
      statusCode: 200,
      msg: `Plan ${plan} asignado exitosamente al usuario ${usuario.nombreUsuario}`,
    };
  } catch (error) {
    return {
      error: error.message,
      statusCode: 500,
      msg: "Error interno del servidor",
    };
  }
};

const verificarPlanActivoDb = async (idUsuario) => {
  try {
    const PlanContratadoModel = require("../models/planContratado.model");

    const planActivo = await PlanContratadoModel.findOne({
      idUsuario: idUsuario,
      estado: "activo",
      fechaVencimiento: { $gt: new Date() },
    }).sort({ fechaVencimiento: -1 });

    if (!planActivo) {
      return {
        statusCode: 404,
        msg: "No tienes un plan activo",
        planActivo: false,
        plan: null,
      };
    }

    return {
      statusCode: 200,
      msg: "Plan activo encontrado",
      planActivo: true,
      plan: planActivo.plan,
      fechaVencimiento: planActivo.fechaVencimiento,
    };
  } catch (error) {
    return {
      error,
      statusCode: 500,
      msg: "Error interno del servidor",
    };
  }
};

// Sincroniza usuarios.plan y usuarios.fechaVencimiento desde planContratado
const sincronizarPlanesUsuariosDb = async () => {
  try {
    const PlanContratadoModel = require("../models/planContratado.model");
    const usuarios = await UsuariosModel.find();

    let actualizados = 0;
    for (const usuario of usuarios) {
      const planActivo = await PlanContratadoModel.findOne({
        idUsuario: usuario._id,
        estado: "activo",
        fechaVencimiento: { $gt: new Date() },
      }).sort({ fechaVencimiento: -1 });

      if (planActivo) {
        usuario.plan = planActivo.plan;
        usuario.fechaVencimiento = planActivo.fechaVencimiento;
        await usuario.save();
        actualizados++;
      } else if (usuario.plan !== "Sin plan" || usuario.fechaVencimiento) {
        usuario.plan = "Sin plan";
        usuario.fechaVencimiento = null;
        await usuario.save();
        actualizados++;
      }
    }

    return {
      statusCode: 200,
      msg: `Sincronización completada. Usuarios actualizados: ${actualizados}`,
      actualizados,
    };
  } catch (error) {
    return {
      error: error.message,
      statusCode: 500,
      msg: "Error al sincronizar planes",
    };
  }
};

// Verifica disponibilidad de nombreUsuario y/o emailUsuario
const verificarDisponibilidadUsuarioDb = async ({
  nombreUsuario,
  emailUsuario,
}) => {
  try {
    const query = [];
    if (nombreUsuario) {
      query.push({ nombreUsuario: String(nombreUsuario).toLowerCase() });
    }
    if (emailUsuario) {
      query.push({ emailUsuario: String(emailUsuario).toLowerCase() });
    }

    if (query.length === 0) {
      return {
        statusCode: 400,
        msg: "Debe proporcionar nombreUsuario y/o emailUsuario",
      };
    }

    const existente = await UsuariosModel.findOne({ $or: query });

    const disponibleUsuario = nombreUsuario
      ? !(
          existente &&
          existente.nombreUsuario === String(nombreUsuario).toLowerCase()
        )
      : undefined;
    const disponibleEmail = emailUsuario
      ? !(
          existente &&
          existente.emailUsuario === String(emailUsuario).toLowerCase()
        )
      : undefined;

    return {
      statusCode: 200,
      msg: "Consulta de disponibilidad exitosa",
      disponibleUsuario,
      disponibleEmail,
    };
  } catch (error) {
    return {
      statusCode: 500,
      msg: "Error interno del servidor",
      error,
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
  // migrarContraseniasDb, // Comentada - función de migración ya no necesaria
  asignarPlanUsuarioDb,
  verificarPlanActivoDb,
  verificarDisponibilidadUsuarioDb,
  solicitarRecuperacionContraseniaDb,
  restablecerContraseniaDb,
};

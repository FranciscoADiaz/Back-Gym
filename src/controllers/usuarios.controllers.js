const {
  registroUsuarioDb,
  inicioSesionUsuarioDb,
  habilitarDeshabilitarUsuarioDb,
  obtenerTodosLosUsuariosDb,
  eliminarUsuarioDb,
  crearUsuarioDb,
  actualizarUsuarioDb,
  // migrarContraseniasDb, // Comentada - función de migración ya no necesaria
  asignarPlanUsuarioDb,
  verificarPlanActivoDb,
  sincronizarPlanesUsuariosDb,
  verificarDisponibilidadUsuarioDb,
  solicitarRecuperacionContraseniaDb,
  restablecerContraseniaDb,
} = require("../services/usuarios.services");
const { validationResult } = require("express-validator");

const obtenerPrimerError = (errores) =>
  errores.array()[0]?.msg || "Datos inválidos";

const registroUsuario = async (req, res) => {
  const respuesta = validationResult(req);
  if (!respuesta.isEmpty()) {
    return res.status(422).json({ msg: obtenerPrimerError(respuesta) });
  }

  const { msg, statusCode, error } = await registroUsuarioDb(req.body);
  try {
    res.status(statusCode).json({ msg });
  } catch {
    console.error(error);
    res.status(statusCode).json({ error });
  }
};

const inicioSesionUsuario = async (req, res) => {
  const respuesta = validationResult(req);
  if (!respuesta.isEmpty()) {
    return res.status(422).json({ msg: obtenerPrimerError(respuesta) });
  }

  const { success, msg, statusCode, token, error, rolUsuario } =
    await inicioSesionUsuarioDb(req.body);
  try {
    res.status(statusCode).json({
      success: success || false,
      msg,
      token,
      rolUsuario,
    });
  } catch {
    res.status(statusCode).json({
      success: false,
      error,
    });
  }
};

const solicitarRecuperacionContrasenia = async (req, res) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(422).json({ msg: obtenerPrimerError(errores) });
  }

  const { statusCode, msg, error } =
    await solicitarRecuperacionContraseniaDb(req.body.emailUsuario);

  if (error) {
    return res.status(statusCode).json({ msg, error });
  }

  return res.status(statusCode).json({ msg });
};

const restablecerContrasenia = async (req, res) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(422).json({ msg: obtenerPrimerError(errores) });
  }

  const { statusCode, msg, error } = await restablecerContraseniaDb(req.body);

  if (error) {
    return res.status(statusCode).json({ msg, error });
  }

  return res.status(statusCode).json({ msg });
};

const habilitarDeshabilitarUsuario = async (req, res) => {
  const respuesta = validationResult(req);
  if (!respuesta.isEmpty()) {
    return res.status(422).json({ msg: obtenerPrimerError(respuesta) });
  }

  const { msg, statusCode, error } = await habilitarDeshabilitarUsuarioDb(
    req.params.id
  );
  try {
    res.status(statusCode).json({ msg });
  } catch {
    res.status(statusCode).json({ error });
  }
};

const obtenerTodosLosUsuarios = async (req, res) => {
  const { usuarios, statusCode, error } = await obtenerTodosLosUsuariosDb();
  try {
    res.status(statusCode).json({ usuarios });
  } catch {
    res.status(statusCode).json({ error });
  }
};

const eliminarUsuario = async (req, res) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(422).json({ msg: obtenerPrimerError(errores) });
  }

  const { msg, statusCode, error } = await eliminarUsuarioDb(req.params.id);

  if (error) {
    return res.status(statusCode).json({ error });
  }

  return res.status(statusCode).json({ msg });
};

const crearUsuario = async (req, res) => {
  const { msg, statusCode, error } = await crearUsuarioDb(req.body);
  try {
    res.status(statusCode).json({ msg });
  } catch {
    res.status(statusCode).json({ error });
  }
};

const actualizarUsuario = async (req, res) => {
  try {
    const { msg, statusCode, error } = await actualizarUsuarioDb(
      req.params.id,
      req.body
    );

    if (error) {
      console.error("Error en actualizarUsuario:", error);
      return res.status(statusCode).json({
        msg: "Error al actualizar usuario",
        error: error,
      });
    }

    res.status(statusCode).json({ msg });
  } catch (error) {
    console.error("Error inesperado en actualizarUsuario:", error);
    res.status(500).json({
      msg: "Error interno del servidor",
      error: error.message,
    });
  }
};

const obtenerUsuarioPorId = async (req, res) => {
  const { usuario, statusCode, error } = await obtenerUsuarioPorIdDb(
    req.params.id
  );
  try {
    res.status(statusCode).json({ usuario });
  } catch {
    res.status(statusCode).json({ error });
  }
};

const asignarPlanUsuario = async (req, res) => {
  const respuesta = validationResult(req);
  if (!respuesta.isEmpty()) {
    return res.status(422).json({ msg: respuesta.array() });
  }

  const { msg, statusCode, error } = await asignarPlanUsuarioDb(
    req.params.id,
    req.body
  );

  if (error) {
    return res.status(statusCode).json({ error });
  }

  res.status(statusCode).json({ msg });
};

const listarPlanesContratados = async (req, res) => {
  try {
    const PlanContratadoModel = require("../models/planContratado.model");
    const planes = await PlanContratadoModel.find().populate(
      "idUsuario",
      "nombreUsuario emailUsuario"
    );

    res.status(200).json({
      success: true,
      planes: planes,
      total: planes.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: "Error interno del servidor",
      error: error.message,
    });
  }
};

const crearPlanPrueba = async (req, res) => {
  try {
    const { idUsuario } = req.params;

    const PlanContratadoModel = require("../models/planContratado.model");

    const fechaVencimiento = new Date();
    fechaVencimiento.setMonth(fechaVencimiento.getMonth() + 6);

    const planPrueba = await PlanContratadoModel.create({
      idUsuario: idUsuario,
      plan: "Completo",
      duracion: 6,
      precio: 30000,
      fechaInicio: new Date(),
      fechaVencimiento: fechaVencimiento,
      estado: "activo",
    });

    res.status(200).json({
      success: true,
      msg: "Plan de prueba creado exitosamente",
      plan: planPrueba,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: "Error interno del servidor",
      error: error.message,
    });
  }
};

const verificarPlanActivo = async (req, res) => {
  try {
    const { idUsuario } = req.params;

    const { msg, statusCode, error, planActivo, plan, fechaVencimiento } =
      await verificarPlanActivoDb(idUsuario);

    res.status(statusCode).json({
      msg,
      planActivo,
      plan,
      fechaVencimiento,
    });
  } catch (error) {
    res.status(500).json({
      msg: "Error interno del servidor",
      error: error.message,
    });
  }
};

const obtenerMiPlan = async (req, res) => {
  try {
    // Usar el ID del usuario que viene del middleware de autenticación
    const idUsuario = req.idUsuario;

    const PlanContratadoModel = require("../models/planContratado.model");
    const PlanesModel = require("../models/planes.model");

    // Primero buscar cualquier plan del usuario (sin filtros estrictos)
    const todosLosPlanes = await PlanContratadoModel.find({
      idUsuario: idUsuario,
    }).sort({ createdAt: -1 });

    if (todosLosPlanes.length === 0) {
      return res.status(404).json({
        success: false,
        msg: "No tienes ningún plan asignado",
      });
    }

    // Buscar el plan más reciente que esté activo y no vencido
    const planContratado = await PlanContratadoModel.findOne({
      idUsuario: idUsuario,
      estado: "activo",
      fechaVencimiento: { $gt: new Date() },
    }).sort({ fechaVencimiento: -1 });

    if (!planContratado) {
      // Si no hay plan activo, mostrar el más reciente aunque esté vencido
      const planMasReciente = todosLosPlanes[0];

      // Obtener los detalles del plan
      const plan = await PlanesModel.findOne({ tipo: planMasReciente.plan });

      return res.status(200).json({
        success: true,
        data: {
          ...planMasReciente.toObject(),
          plan: plan || {
            nombre: planMasReciente.plan,
            tipo: planMasReciente.plan,
          },
        },
        msg: "Plan encontrado (puede estar vencido)",
      });
    }

    // Obtener los detalles del plan
    const plan = await PlanesModel.findOne({ tipo: planContratado.plan });

    res.status(200).json({
      success: true,
      data: {
        ...planContratado.toObject(),
        plan: plan || {
          nombre: planContratado.plan,
          tipo: planContratado.plan,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: "Error interno del servidor",
      error: error.message,
    });
  }
};

module.exports = {
  registroUsuario,
  inicioSesionUsuario,
  solicitarRecuperacionContrasenia,
  restablecerContrasenia,
  habilitarDeshabilitarUsuario,
  obtenerTodosLosUsuarios,
  eliminarUsuario,
  crearUsuario,
  actualizarUsuario,
  obtenerUsuarioPorId,
  // migrarContrasenias, // Comentada - función de migración ya no necesaria
  asignarPlanUsuario,
  verificarPlanActivo,
  listarPlanesContratados,
  crearPlanPrueba,
  obtenerMiPlan,
  sincronizarPlanesUsuarios: async (req, res) => {
    const { statusCode, msg, error, actualizados } =
      await sincronizarPlanesUsuariosDb();
    if (error) {
      return res.status(statusCode).json({ msg, error });
    }
    res.status(statusCode).json({ msg, actualizados });
  },
  verificarDisponibilidadUsuario: async (req, res) => {
    const { nombreUsuario, emailUsuario } = req.query;
    const { statusCode, msg, disponibleUsuario, disponibleEmail, error } =
      await verificarDisponibilidadUsuarioDb({ nombreUsuario, emailUsuario });
    if (error) {
      return res.status(statusCode).json({ msg, error });
    }
    return res
      .status(statusCode)
      .json({ msg, disponibleUsuario, disponibleEmail });
  },
};

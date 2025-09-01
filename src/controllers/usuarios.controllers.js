const {
  registroUsuarioDb,
  inicioSesionUsuarioDb,
  habilitarDeshabilitarUsuarioDb,
  obtenerTodosLosUsuariosDb,
  eliminarUsuarioDb,
  crearUsuarioDb,
  actualizarUsuarioDb,
  migrarContraseniasDb,
  asignarPlanUsuarioDb,
} = require("../services/usuarios.services");
const { validationResult } = require("express-validator");

const registroUsuario = async (req, res) => {
  const respuesta = validationResult(req);
  if (!respuesta.isEmpty()) {
    return res.status(422).json({ msg: respuesta.array() });
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
    return res.status(422).json({ msg: respuesta.array() });
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

const habilitarDeshabilitarUsuario = async (req, res) => {
  const respuesta = validationResult(req);
  if (!respuesta.isEmpty()) {
    return res.status(422).json({ msg: respuesta.array() });
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
    return res.status(422).json({ msg: errores.array() });
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

const migrarContrasenias = async (req, res) => {
  const { msg, statusCode, error, usuariosMigrados } =
    await migrarContraseniasDb();
  try {
    res.status(statusCode).json({
      msg,
      usuariosMigrados: usuariosMigrados || 0,
    });
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
  try {
    res.status(statusCode).json({ msg });
  } catch {
    res.status(statusCode).json({ error });
  }
};

module.exports = {
  registroUsuario,
  inicioSesionUsuario,
  habilitarDeshabilitarUsuario,
  obtenerTodosLosUsuarios,
  eliminarUsuario,
  crearUsuario,
  actualizarUsuario,
  obtenerUsuarioPorId,
  migrarContrasenias,
  asignarPlanUsuario,
};

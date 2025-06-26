const { registroUsuarioDb, inicioSesionUsuarioDb, habilitarDeshabilitarUsuarioDb } = require("../services/usuarios.services");
const {validationResult} = require("express-validator");


const registroUsuario = async (req, res) => {
  const respuesta = validationResult(req);
  if (!respuesta.isEmpty()) {
    return res.status(422).json({ msg: respuesta.array() });
  }

  const { msg, statusCode, error } = await registroUsuarioDb(req.body); 
 try { 
  res.status(statusCode).json({msg});
 }

 catch {
    res.status(statusCode).json({ error });
}
}

const inicioSesionUsuario = async (req, res) => {
  const respuesta = validationResult(req);
  if (!respuesta.isEmpty()) {
    return res.status(422).json({ msg: respuesta.array() });
  }
 
  const { msg, statusCode, token, error } = await inicioSesionUsuarioDb(req.body);
  try {
    res.status(statusCode).json({ msg, token });

  } catch  {
    res.status(statusCode).json({ error });
  }
  
};


const habilitarDeshabilitarUsuario = async (req, res) => {

  const respuesta = validationResult(req);
  if (!respuesta.isEmpty()) {
    return res.status(422).json({ msg: respuesta.array() });
  }

  const { msg, statusCode, error } = await habilitarDeshabilitarUsuarioDb(req.params.id);
  try {
    res.status(statusCode).json({ msg });
  } catch {
    res.status(statusCode).json({ error });
  }
}

module.exports = {
  registroUsuario,
  inicioSesionUsuario,
  habilitarDeshabilitarUsuario
};

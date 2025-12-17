const { validationResult } = require("express-validator");
const { sendContactEmail } = require("../helpers/messages.helpers");

const obtenerPrimerError = (errores) =>
  errores.array()[0]?.msg || "Datos inválidos";

const sendContactMessage = async (req, res) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(422).json({ msg: obtenerPrimerError(errores) });
  }

  const { nombre, email, mensaje } = req.body;
  const { success, statusCode = 500, msg, error } = await sendContactEmail(
    {
      nombre,
      email,
      mensaje,
    }
  );

  if (!success) {
    return res.status(statusCode).json({
      msg: error || "No pudimos enviar tu mensaje. Intenta más tarde.",
    });
  }

  return res
    .status(statusCode)
    .json({ msg: msg || "Mensaje enviado correctamente" });
};

module.exports = { sendContactMessage };


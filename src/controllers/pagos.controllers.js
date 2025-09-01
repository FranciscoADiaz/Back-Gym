const {
  crearPreferenciaDb,
  procesarWebhookDb,
  verificarPagoDb,
} = require("../services/pagos.services");

const crearPreferencia = async (req, res) => {
  try {
    const { success, init_point, preference_id, statusCode, msg } =
      await crearPreferenciaDb(req.body, req.usuario);

    res.status(statusCode).json({
      success,
      init_point,
      preference_id,
      msg,
    });
  } catch (error) {
    console.error("Error en crear preferencia:", error);
    res.status(500).json({
      success: false,
      msg: "Error interno del servidor",
    });
  }
};

const procesarWebhook = async (req, res) => {
  try {
    const { success, statusCode, msg } = await procesarWebhookDb(req.body);

    if (success) {
      res.status(statusCode).send("OK");
    } else {
      res.status(statusCode).send("Error");
    }
  } catch (error) {
    console.error("Error en webhook:", error);
    res.status(500).send("Error");
  }
};

const verificarPago = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const { success, status, amount, description, statusCode, msg } =
      await verificarPagoDb(paymentId);

    res.status(statusCode).json({
      success,
      status,
      amount,
      description,
      msg,
    });
  } catch (error) {
    console.error("Error al verificar pago:", error);
    res.status(500).json({
      success: false,
      msg: "Error interno del servidor",
    });
  }
};

module.exports = {
  crearPreferencia,
  procesarWebhook,
  verificarPago,
};


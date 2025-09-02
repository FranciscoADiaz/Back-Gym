const { preference } = require("../config/mercadopago.config");
const { Payment } = require("mercadopago");
const UsuariosModel = require("../models/usuarios.model");
const PlanContratadoModel = require("../models/planContratado.model");

const crearPreferenciaDb = async (body, usuario) => {
  try {
    const { plan, duracion, precio } = body;
    const { nombreUsuario, emailUsuario, _id: idUsuario } = usuario;

    // Crear preferencia de MercadoPago
    const preferenceData = {
      items: [
        {
          title: `Plan ${plan} - ${duracion} mes${duracion > 1 ? "es" : ""}`,
          unit_price: precio,
          quantity: 1,
        },
      ],
      payer: {
        name: nombreUsuario,
        email: emailUsuario,
      },
      back_urls: {
        success: `${process.env.FRONTEND_URL}/pago-exitoso`,
        failure: `${process.env.FRONTEND_URL}/pago-fallido`,
        pending: `${process.env.FRONTEND_URL}/pago-pendiente`,
      },
      auto_return: "approved",
      external_reference: `${idUsuario}_${Date.now()}`,
      notification_url: `${process.env.BACKEND_URL}/api/pagos/webhook`,
    };

    const response = await preference.create({ body: preferenceData });

    return {
      success: true,
      init_point: response.init_point,
      preference_id: response.id,
      statusCode: 200,
    };
  } catch (error) {
    console.error("Error al crear preferencia:", error);
    return {
      success: false,
      msg: "Error al procesar el pago",
      statusCode: 500,
    };
  }
};

const procesarWebhookDb = async (body) => {
  try {
    const { type, data } = body;

    if (type === "payment") {
      const paymentClient = new Payment({
        accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
      });
      const payment = await paymentClient.get({ id: data.id });

      if (payment.status === "approved") {
        // Extraer información del external_reference
        const [userId, timestamp] = payment.external_reference.split("_");

        // Extraer información del título del item
        const title = payment.description;
        const planMatch = title.match(/Plan (.+?) - (\d+) mes/);

        if (planMatch) {
          const plan = planMatch[1];
          const duracion = parseInt(planMatch[2]);

          // Calcular fecha de vencimiento
          const fechaVencimiento = new Date();
          fechaVencimiento.setMonth(fechaVencimiento.getMonth() + duracion);

          // Guardar plan contratado
          await PlanContratadoModel.create({
            idUsuario: userId,
            plan,
            duracion,
            precio: payment.transaction_amount,
            fechaVencimiento,
            paymentId: payment.id,
            preferenceId: payment.preference_id,
          });

          // Actualizar usuario
          await UsuariosModel.findByIdAndUpdate(userId, {
            plan: plan,
            fechaVencimiento: fechaVencimiento,
          });
        }
      }
    }

    return {
      success: true,
      statusCode: 200,
    };
  } catch (error) {
    return {
      success: false,
      msg: "Error procesando webhook",
      statusCode: 500,
    };
  }
};

const verificarPagoDb = async (paymentId) => {
  try {
    const paymentClient = new Payment({
      accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
    });
    const payment = await paymentClient.get({ id: paymentId });

    return {
      success: true,
      status: payment.status,
      amount: payment.transaction_amount,
      description: payment.description,
      statusCode: 200,
    };
  } catch (error) {
    return {
      success: false,
      msg: "Error al verificar el pago",
      statusCode: 500,
    };
  }
};

module.exports = {
  crearPreferenciaDb,
  procesarWebhookDb,
  verificarPagoDb,
};

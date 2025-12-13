const { preference } = require("../config/mercadopago.config");
const { Payment } = require("mercadopago");
const UsuariosModel = require("../models/usuarios.model");
const PlanContratadoModel = require("../models/planContratado.model");

const FRONT_URL =
  (process.env.FRONTEND_URL && process.env.FRONTEND_URL.trim()) ||
  "http://localhost:5173";
const BACK_URL =
  (process.env.BACKEND_URL && process.env.BACKEND_URL.trim()) ||
  "http://localhost:3005";

const crearPreferenciaDb = async (body, usuario) => {
  try {
    const { plan, duracion, precio } = body;
    // El payload del token puede venir con idUsuario (login) o _id (objeto completo)
    const idUsuario = usuario?._id || usuario?.idUsuario;
    const nombreUsuario = usuario?.nombreUsuario || "";
    const emailUsuario = usuario?.emailUsuario || "";

    if (!idUsuario) {
      throw new Error("No se pudo obtener el idUsuario del token");
    }

    // Crear preferencia de MercadoPago con metadata (para no depender del título/description)
    const front = FRONT_URL.replace(/\/$/, "");
    const back = BACK_URL.replace(/\/$/, "");

    // Validar URLs requeridas por MercadoPago
    if (!front || !/^https?:\/\//.test(front)) {
      return {
        success: false,
        msg: "Falta configurar FRONTEND_URL con http/https",
        statusCode: 500,
      };
    }
    // Logs de depuración deshabilitados para producción

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
        success: `${front}/pago-exitoso`,
        failure: `${front}/pago-fallido`,
        pending: `${front}/pago-pendiente`,
      },
      external_reference: `${idUsuario}_${Date.now()}`,
      notification_url: `${back}/api/pagos/webhook`,
      metadata: {
        userId: idUsuario.toString(),
        plan,
        duracion,
        precio,
      },
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
        const meta = payment.metadata || {};
        const userId =
          meta.userId ||
          (payment.external_reference || "").split("_")[0] ||
          null;
        const plan = meta.plan;
        const duracion = meta.duracion;
        const precio = payment.transaction_amount;

        if (userId && plan && duracion) {
          const fechaVencimiento = new Date();
          fechaVencimiento.setMonth(
            fechaVencimiento.getMonth() + parseInt(duracion)
          );

          await PlanContratadoModel.create({
            idUsuario: userId,
            plan,
            duracion: parseInt(duracion),
            precio,
            fechaVencimiento,
            paymentId: payment.id,
            preferenceId: payment.preference_id,
          });

          await UsuariosModel.findByIdAndUpdate(userId, {
            plan,
            fechaVencimiento,
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
      description:
        payment.description ||
        payment.additional_info?.items?.[0]?.title ||
        "",
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

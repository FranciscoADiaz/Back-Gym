const PlanContratadoModel = require("../models/planContratado.model");
const UsuariosModel = require("../models/usuarios.model");

const contratarPlanService = async (body, usuarioId) => {
  try {
    const { plan, duracion, precio, metodoPago } = body;

    if (!plan || !duracion || !precio || !metodoPago) {
      return {
        statusCode: 400,
        msg: "Faltan campos requeridos",
      };
    }

    // Calcular fecha de vencimiento
    const fechaInicio = new Date();
    const fechaVencimiento = new Date();
    fechaVencimiento.setMonth(fechaVencimiento.getMonth() + parseInt(duracion));

    // Crear nuevo plan contratado
    const nuevoPlan = new PlanContratadoModel({
      idUsuario: usuarioId,
      plan,
      duracion,
      precio,
      fechaInicio,
      fechaVencimiento,
      estado: "activo",
    });

    await nuevoPlan.save();

    // Actualizar el usuario con el nuevo plan
    await UsuariosModel.findByIdAndUpdate(usuarioId, {
      plan,
      fechaVencimiento,
    });

    return {
      statusCode: 201,
      msg: "Plan contratado exitosamente",
      plan: nuevoPlan,
    };
  } catch (error) {
    return {
      error,
      statusCode: 500,
      msg: "Error interno del servidor",
    };
  }
};

const renovarPlanService = async (idPlan) => {
  try {
    const plan = await PlanContratadoModel.findById(idPlan);
    if (!plan) {
      return {
        statusCode: 404,
        msg: "Plan no encontrado",
      };
    }

    // Extender la fecha de vencimiento
    const nuevaFechaVencimiento = new Date(plan.fechaVencimiento);
    nuevaFechaVencimiento.setMonth(
      nuevaFechaVencimiento.getMonth() + parseInt(plan.duracion)
    );

    plan.fechaVencimiento = nuevaFechaVencimiento;
    await plan.save();

    // Actualizar usuario
    await UsuariosModel.findByIdAndUpdate(plan.idUsuario, {
      fechaVencimiento: nuevaFechaVencimiento,
    });

    return {
      statusCode: 200,
      msg: "Plan renovado exitosamente",
    };
  } catch (error) {
    return {
      error,
      statusCode: 500,
      msg: "Error interno del servidor",
    };
  }
};

const cancelarPlanService = async (idPlan) => {
  try {
    const plan = await PlanContratadoModel.findById(idPlan);
    if (!plan) {
      return {
        statusCode: 404,
        msg: "Plan no encontrado",
      };
    }

    plan.estado = "cancelado";
    await plan.save();

    // Actualizar usuario
    await UsuariosModel.findByIdAndUpdate(plan.idUsuario, {
      plan: "Sin plan",
      fechaVencimiento: null,
    });

    return {
      statusCode: 200,
      msg: "Plan cancelado exitosamente",
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
  contratarPlanService,
  renovarPlanService,
  cancelarPlanService,
};

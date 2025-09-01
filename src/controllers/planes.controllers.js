const {
  contratarPlanService,
  renovarPlanService,
  cancelarPlanService,
} = require("../services/planes.services");

const contratarPlan = async (req, res) => {
  try {
    const { msg, statusCode, plan, error } = await contratarPlanService(
      req.body,
      req.idUsuario
    );
    res.status(statusCode).json({ msg, plan });
  } catch (error) {
    res.status(500).json({ msg: "Error al contratar plan", error });
  }
};

const renovarPlan = async (req, res) => {
  try {
    const { msg, statusCode, error } = await renovarPlanService(req.params.id);
    res.status(statusCode).json({ msg });
  } catch (error) {
    res.status(500).json({ msg: "Error al renovar plan", error });
  }
};

const cancelarPlan = async (req, res) => {
  try {
    const { msg, statusCode, error } = await cancelarPlanService(req.params.id);
    res.status(statusCode).json({ msg });
  } catch (error) {
    res.status(500).json({ msg: "Error al cancelar plan", error });
  }
};

module.exports = {
  contratarPlan,
  renovarPlan,
  cancelarPlan,
};


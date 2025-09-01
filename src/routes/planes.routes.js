const { Router } = require("express");
const router = Router();
const auth = require("../middlewares/auth");
const { check } = require("express-validator");

const {
  contratarPlan,
  renovarPlan,
  cancelarPlan,
} = require("../controllers/planes.controllers");

// POST - Contratar plan
router.post("/contratar", auth("usuario"), contratarPlan);

// PUT - Renovar plan
router.put(
  "/:id/renovar",
  [
    check(
      "id",
      "❌ ERROR ID: El formato de ID no corresponde a MongoDB"
    ).isMongoId(),
  ],
  auth("usuario"),
  renovarPlan
);

// PUT - Cancelar plan
router.put(
  "/:id/cancelar",
  [
    check(
      "id",
      "❌ ERROR ID: El formato de ID no corresponde a MongoDB"
    ).isMongoId(),
  ],
  auth("usuario"),
  cancelarPlan
);

module.exports = router;


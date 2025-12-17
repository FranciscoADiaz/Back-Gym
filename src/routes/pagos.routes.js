const { Router } = require("express");
const router = Router();
const {
  createPaymentPreference,
  processPaymentWebhook,
  verifyPayment,
} = require("../controllers/pagos.controllers");
const auth = require("../middlewares/auth");
const { check } = require("express-validator");
const validateRequest = require("../middlewares/validateRequest");

// POST - Crear preferencia de pago (usuario autenticado)
router.post(
  "/crear-preferencia",
  [
    check("plan", "El plan es requerido").notEmpty(),
    check("duracion", "La duración es requerida").isNumeric(),
    check("precio", "El precio es requerido").isNumeric(),
  ],
  auth("usuario"),
  validateRequest,
  createPaymentPreference
);

// POST - Webhook para recibir notificaciones de pago (sin autenticación)
router.post("/webhook", processPaymentWebhook);

// GET - Verificar estado de pago (usuario autenticado)
router.get(
  "/verificar/:paymentId",
  [check("paymentId", "El ID del pago es requerido").notEmpty()],
  auth("usuario"),
  validateRequest,
  verifyPayment
);

module.exports = router;


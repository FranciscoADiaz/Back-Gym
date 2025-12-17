const { Router } = require("express");
const { check } = require("express-validator");
const { sendContactMessage } = require("../controllers/contacto.controllers");
const validateRequest = require("../middlewares/validateRequest");

const router = Router();

router.post(
  "/",
  [
    check("nombre", "El nombre es requerido").trim().notEmpty(),
    check("email", "El email es requerido").trim().notEmpty(),
    check("email", "El email no es válido").isEmail(),
    check("mensaje", "El mensaje es requerido").trim().notEmpty(),
    check(
      "mensaje",
      "El mensaje debe tener al menos 10 caracteres"
    ).isLength({ min: 10 }),
  ],
  validateRequest,
  sendContactMessage
);

module.exports = router;


const { Router } = require("express");
const router = Router();
const auth = require("../middlewares/auth");
const { check } = require("express-validator");

const {
  obtenerClasesDelDia,
} = require("../controllers/reserva.controllers");


router.get("/", obtenerClasesDelDia);

module.exports = router;

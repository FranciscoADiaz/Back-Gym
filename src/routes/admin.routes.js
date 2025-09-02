const { Router } = require("express");
const router = Router();
const auth = require("../middlewares/auth");
const { check } = require("express-validator");

const {
  obtenerClasesDelDia,
  obtenerClasesProximosDias,
  obtenerTodasLasReservasAdmin,
} = require("../controllers/reserva.controllers");

router.get("/", obtenerClasesDelDia);
router.get("/proximos-dias", obtenerClasesProximosDias);
router.get("/todas-las-reservas", obtenerTodasLasReservasAdmin);

module.exports = router;

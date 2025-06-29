const { Router } = require("express");
const router = Router();
const auth = require("../middlewares/auth");
const { check } = require("express-validator");

const {
  crearReserva,
  obtenerReservas,
  cancelarReserva,
} = require("../controllers/reserva.controllers");

router.post("/", crearReserva);
router.get("/", obtenerReservas);
router.delete("/:id", cancelarReserva);

module.exports = router;

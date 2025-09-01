const { Router } = require("express");
const router = Router();
const auth = require("../middlewares/auth");
const { check } = require("express-validator");

const {
  crearReserva,
  obtenerReservas,
  cancelarReserva,
  verificarCupos,
  obtenerReservasPorFecha,
} = require("../controllers/reserva.controllers");

// Middleware de autenticación para todas las rutas
router.use(auth("usuario"));

// POST - Crear una nueva reserva
router.post("/", crearReserva);

// GET - Obtener todas las reservas (para admin) o reservas del usuario
router.get("/", obtenerReservas);

// GET - Verificar cupos disponibles
router.get("/cupos", verificarCupos);

// GET - Obtener reservas por fecha (para admin)
router.get("/fecha/:fecha", auth("admin"), obtenerReservasPorFecha);

// DELETE - Cancelar una reserva
router.delete("/:id", cancelarReserva);

module.exports = router;

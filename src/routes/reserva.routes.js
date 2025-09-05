const { Router } = require("express");
const router = Router();
const auth = require("../middlewares/auth");
const { check } = require("express-validator");

const {
  crearReserva,
  obtenerReservas,
  obtenerReservasUsuario,
  cancelarReserva,
  verificarCupos,
  obtenerReservasPorFecha,
  obtenerProfesoresHorarios,
} = require("../controllers/reserva.controllers");

// Endpoint público para obtener horarios de profesores (sin auth)
router.get("/profesores-horarios", (req, res) =>
  obtenerProfesoresHorarios(req, res)
);

// Middleware de autenticación para las demás rutas
router.use(auth("usuario"));

// POST - Crear una nueva reserva
router.post("/", crearReserva);

// GET - Obtener todas las reservas (para admin) o reservas del usuario
router.get("/", obtenerReservas);

// GET - Obtener reservas de un usuario específico
router.get("/usuario/:idUsuario", auth("usuario"), obtenerReservasUsuario);

// GET - Verificar cupos disponibles
router.get("/cupos", verificarCupos);

// GET - Obtener reservas por fecha (para admin)
router.get("/fecha/:fecha", auth("admin"), obtenerReservasPorFecha);

// DELETE - Cancelar una reserva
router.delete("/:id", cancelarReserva);

module.exports = router;

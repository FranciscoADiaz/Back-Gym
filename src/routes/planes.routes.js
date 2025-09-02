const { Router } = require("express");
const router = Router();
const auth = require("../middlewares/auth");
const { check } = require("express-validator");

const {
  obtenerTodosLosPlanes,
  obtenerPlanPorId,
  obtenerPlanesPorTipo,
  crearPlan,
  actualizarPlan,
  eliminarPlan,
  cambiarEstadoPlan,
  buscarPlanes,
} = require("../controllers/planes.controllers.js");

// Rutas para obtener planes
router.get("/", obtenerTodosLosPlanes);
router.get("/buscar", buscarPlanes);
router.get("/tipo/:tipo", obtenerPlanesPorTipo);
router.get("/:id", obtenerPlanPorId);

// Rutas para crear y modificar planes
router.post("/", crearPlan);
router.put("/:id", actualizarPlan);
router.delete("/:id", eliminarPlan);
router.patch("/:id/estado", cambiarEstadoPlan);

module.exports = router;

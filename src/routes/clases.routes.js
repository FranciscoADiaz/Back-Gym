const { Router } = require("express");
const router = Router();

const {
  obtenerTodasLasClases,
  obtenerClasePorId,
  obtenerClasesPorTipo,
  crearClase,
  actualizarClase,
  eliminarClase,
  cambiarEstadoClase,
  buscarClases,
} = require("../controllers/clases.controllers.js");

// Rutas para obtener clases
router.get("/", obtenerTodasLasClases);
router.get("/buscar", buscarClases);
router.get("/tipo/:tipoClase", obtenerClasesPorTipo);
router.get("/:id", obtenerClasePorId);

// Rutas para crear y modificar clases
router.post("/", crearClase);
router.put("/:id", actualizarClase);
router.delete("/:id", eliminarClase);
router.patch("/:id/estado", cambiarEstadoClase);

module.exports = router;

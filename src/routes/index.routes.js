const { Router } = require("express");
const router = Router();

const usuariosRoutes = require("./usuarios.routes.js");
const productosRoutes = require("./productos.routes.js");
const planesRoutes = require("./planes.routes.js");
const pagosRoutes = require("./pagos.routes.js");
const contactoRoutes = require("./contacto.routes.js");

router.use("/usuarios", usuariosRoutes);
router.use("/productos", productosRoutes);
router.use("/planes", planesRoutes);
router.use("/pagos", pagosRoutes);
router.use("/contacto", contactoRoutes);

module.exports = router;

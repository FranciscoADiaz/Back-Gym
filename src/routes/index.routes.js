const { Router } = require("express");
const router = Router();

const usuariosRoutes = require("./usuarios.routes.js");
const productosRoutes = require("./productos.routes.js");
const reservasRoutes = require("./reserva.routes.js");
const adminRoutes = require("./admin.routes.js");
const planesRoutes = require("./planes.routes.js");
const pagosRoutes = require("./pagos.routes.js");

router.use("/usuarios", usuariosRoutes);
router.use("/productos", productosRoutes);
router.use("/reservar", reservasRoutes);
router.use("/admin", adminRoutes);
router.use("/planes", planesRoutes);
router.use("/pagos", pagosRoutes);

module.exports = router;

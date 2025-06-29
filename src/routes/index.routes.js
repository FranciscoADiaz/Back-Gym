const {Router} = require('express');
const router = Router();    

const usuariosRoutes = require("./usuarios.routes.js");
const productosRoutes = require("./productos.routes.js");
const reservasRoutes = require("./reserva.routes.js");

router.use("/usuarios", usuariosRoutes);
router.use("/productos", productosRoutes);
router.use("/reservar", reservasRoutes);


module.exports = router; 
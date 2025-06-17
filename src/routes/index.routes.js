const {Router} = require('express');
const router = Router();    

const usuariosRoutes = require("./usuarios.routes.js");
const productosRoutes = require("./productos.routes.js");

router.use("/usuarios", usuariosRoutes);
router.use("/productos", productosRoutes);


module.exports = router; 
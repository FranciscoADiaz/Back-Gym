const {Router} = require('express');
const router = Router();    
const { registroUsuario, inicioSesionUsuario, habilitarDeshabilitarUsuario } = require("../controllers/usuarios.controllers");
const auth = require("../middlewares/auth");
const { check } = require('express-validator');


router.post("/register", registroUsuario);
router.post("/login", inicioSesionUsuario);
router.put("/enableDisable/:id", auth("admin"), habilitarDeshabilitarUsuario);



module.exports = router;


const {Router} = require('express');
const router = Router();    
const { registroUsuario, inicioSesionUsuario, habilitarDeshabilitarUsuario } = require("../controllers/usuarios.controllers");

router.post("/register", registroUsuario);
router.post("/login", inicioSesionUsuario);
router.put("/enableDisable/:id", habilitarDeshabilitarUsuario);



module.exports = router;


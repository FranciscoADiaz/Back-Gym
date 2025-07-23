const {Router} = require('express');
const router = Router();    
const { registroUsuario, inicioSesionUsuario, habilitarDeshabilitarUsuario, obtenerTodosLosUsuarios, eliminarUsuario } = require("../controllers/usuarios.controllers");
const auth = require("../middlewares/auth");
const { check } = require('express-validator');


router.post("/registrarse",
  [
      check("nombreUsuario", "Campo NOMBRE esta vacío").notEmpty(),
      check(
        "nombreUsuario",
        "ERROR. Cantidad minima 5 caracteres y máxima 50 carácteres"
      ).isLength({ min: 5 }, { max: 50 }),
      check(
        "nombreUsuario",
        "ERROR. Formato de USUARIO incorrecto, solo se aceptan letras y números"
      ).matches(/^[A-Za-z0-9]+$/),
      check("emailUsuario", "Campo EMAIL está vacío").notEmpty(),
      check("emailUsuario", "ERROR. Formato EMAIL incorrecto").isEmail(),
      check("contrasenia", "Campo CONTRASEÑA esta vacío").notEmpty(),
      check(
        "contrasenia",
        "ERROR. Cantidad minima 8 carácteres y máxima de 32"
      ).isLength({ min: 8 }, { max: 32 }),
    ],
   registroUsuario);

router.post("/iniciarsesion",
  [  
      check("nombreUsuario", "Campo NOMBRE esta vacio").notEmpty(),
      check(
        "nombreUsuario",
        "ERROR. Cantidad minima 5 carácteres y máxima 50"
      ).isLength({ min: 5 }, { max: 50 }),
      check(
        "nombreUsuario",
        "ERROR. Formato de USUARIO incorrecto, solo se aceptan letras y números"
      ).matches(/^[A-Za-z0-9]+$/),
      check("contrasenia", "Campo CONTRASEÑA esta vacío").notEmpty(),
      check(
        "contrasenia",
        "ERROR. Cantidad mínima 8 carácteres y maxima de 32"
      ).isLength({ min: 8 }, { max: 32 }),
    ],
   inicioSesionUsuario);

router.put("/enableDisable/:id", 
  [check("id", "ERROR ID. El formato de ID no corresponde a MongoDB").isMongoId()], 
  auth("admin"), habilitarDeshabilitarUsuario);


  router.get("/", obtenerTodosLosUsuarios);
  
  router.delete("/:id",
    [check("id", "❌ ERROR ID: El formato de ID no corresponde a MongoDB").isMongoId(),
    ], auth("admin"), eliminarUsuario);


module.exports = router;


const { Router } = require("express");
const router = Router();
const {
  registroUsuario,
  inicioSesionUsuario,
  habilitarDeshabilitarUsuario,
  obtenerTodosLosUsuarios,
  eliminarUsuario,
  crearUsuario,
  actualizarUsuario,
  obtenerUsuarioPorId,
  migrarContrasenias,
  asignarPlanUsuario,
  verificarPlanActivo,
  listarPlanesContratados,
  crearPlanPrueba,
  obtenerMiPlan,
  sincronizarPlanesUsuarios,
} = require("../controllers/usuarios.controllers");
const auth = require("../middlewares/auth");
const { check } = require("express-validator");

router.post(
  "/registrarse",
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
  registroUsuario
);

router.post(
  "/iniciarsesion",
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
  inicioSesionUsuario
);

router.put(
  "/enableDisable/:id",
  [
    check(
      "id",
      "ERROR ID. El formato de ID no corresponde a MongoDB"
    ).isMongoId(),
  ],
  auth("admin"),
  habilitarDeshabilitarUsuario
);

// RUTA PARA CREAR USUARIOS (solo admin)
router.post("/crear", auth("admin"), crearUsuario);

// RUTA PARA MIGRAR CONTRASEÑAS A ARGON2 (solo admin)
router.post("/migrar-contrasenias", auth("admin"), migrarContrasenias);

// RUTA PARA ASIGNAR PLAN A USUARIO (solo admin)
router.post(
  "/:id/asignar-plan",
  [
    check("plan", "El plan es requerido").notEmpty(),
    check("duracion", "La duración es requerida").isNumeric(),
    check("precio", "El precio es requerido").isNumeric(),
    check(
      "id",
      "❌ ERROR ID: El formato de ID no corresponde a MongoDB"
    ).isMongoId(),
  ],
  auth("admin"),
  asignarPlanUsuario
);

// RUTA PARA OBTENER TODOS LOS USUARIOS (solo admin)
router.get("/", auth("admin"), obtenerTodosLosUsuarios);

// RUTA PARA VERIFICAR PLAN ACTIVO (usuario común puede verificar su propio plan)
router.get("/:idUsuario/plan-activo", verificarPlanActivo);

// RUTA PARA OBTENER MI PLAN (usuario común)
router.get("/mi-plan", auth("usuario"), obtenerMiPlan);

// RUTA TEMPORAL PARA LISTAR TODOS LOS PLANES CONTRATADOS (solo admin)
router.get("/planes-contratados", auth("admin"), listarPlanesContratados);

// RUTA ADMIN para sincronizar planes a colección usuarios
router.post("/sincronizar-planes", auth("admin"), sincronizarPlanesUsuarios);

// RUTA TEMPORAL PARA CREAR PLAN DE PRUEBA
router.post("/:idUsuario/crear-plan-prueba", crearPlanPrueba);

// RUTA PARA OBTENER USUARIO POR ID (solo admin)
router.get(
  "/:id",
  [
    check(
      "id",
      "❌ ERROR ID: El formato de ID no corresponde a MongoDB"
    ).isMongoId(),
  ],
  auth("admin"),
  obtenerUsuarioPorId
);

// RUTA PARA ACTUALIZAR USUARIOS (solo admin)
router.put("/:id", auth("admin"), actualizarUsuario);

router.delete(
  "/:id",
  [
    check(
      "id",
      "❌ ERROR ID: El formato de ID no corresponde a MongoDB"
    ).isMongoId(),
  ],
  auth("admin"),
  eliminarUsuario
);

module.exports = router;

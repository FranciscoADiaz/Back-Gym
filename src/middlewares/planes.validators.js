const { check, param } = require("express-validator");
const validateRequest = require("./validateRequest");

const planIdValidation = [
  param("id", "ID inválido: debe ser un MongoID").isMongoId(),
  validateRequest,
];

const createPlanValidation = [
  check("nombre", "El nombre es requerido").trim().notEmpty(),
  check("descripcion", "La descripción es requerida").trim().notEmpty(),
  check("tipo", "El tipo es requerido").trim().notEmpty(),
  check("precio", "El precio es requerido y debe ser numérico")
    .notEmpty()
    .isNumeric(),
  check("duracion", "La duración es requerida y debe ser numérica")
    .notEmpty()
    .isNumeric(),
  check("caracteristicas", "Las características deben ser un array")
    .isArray({ min: 1 }),
  validateRequest,
];

const updatePlanValidation = [
  param("id", "ID inválido: debe ser un MongoID").isMongoId(),
  check("precio", "El precio debe ser numérico").optional().isNumeric(),
  check("duracion", "La duración debe ser numérica").optional().isNumeric(),
  check("caracteristicas", "Las características deben ser un array")
    .optional()
    .isArray({ min: 1 }),
  validateRequest,
];

const changeStatusValidation = [
  param("id", "ID inválido: debe ser un MongoID").isMongoId(),
  check("estado", "Estado válido es requerido (activo, inactivo)")
    .trim()
    .notEmpty()
    .isIn(["activo", "inactivo"]),
  validateRequest,
];

module.exports = {
  createPlanValidation,
  updatePlanValidation,
  changeStatusValidation,
  planIdValidation,
};


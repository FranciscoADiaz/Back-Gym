const { validationResult } = require("express-validator");

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const firstError = errors.array()[0]?.msg || "Datos inválidos";
    return res.status(422).json({ msg: firstError });
  }
  next();
};

module.exports = validateRequest;


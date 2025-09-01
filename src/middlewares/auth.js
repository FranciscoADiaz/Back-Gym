const jwt = require("jsonwebtoken");

module.exports = (rolRuta) => async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ msg: "Token no proporcionado" });
    }

    const verificarToken = jwt.verify(token, process.env.JWT_SECRET);

    if (verificarToken.rolUsuario === rolRuta) {
      req.idUsuario = verificarToken.idUsuario;
      req.idCarrito = verificarToken.idCarrito;
      req.idFavoritos = verificarToken.idFavoritos;
      req.usuario = verificarToken; // Agregar para compatibilidad
      req.emailUsuario = verificarToken.emailUsuario; // Agregar email
      next();
    } else {
      res.status(401).json({
        msg: "No estás autorizado para ingresar a esta página",
      });
    }
  } catch (error) {
    res.status(401).json({
      msg: "Token inválido o expirado",
      error: error.message,
    });
  }
};

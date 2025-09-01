const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ msg: "Token no proporcionado" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = decoded;
    req.idUsuario = decoded.idUsuario;
    next();
  } catch (error) {
    return res.status(401).json({ msg: "Token inválido" });
  }
};

module.exports = authMiddleware;


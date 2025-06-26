const jwt = require("jsonwebtoken");

module.exports = (rolRuta) => async (req, res, next) => {
  const token = req.header("auth");
  const verificarToken = jwt.verify(token, process.env.JWT_SECRET);
  
  if (verificarToken.rolUsuario === rolRuta) {
    req.idUsuario = verificarToken.idUsuario;
    req.idCarrito = verificarToken.idCarrito;
    req.idFavoritos = verificarToken.idFavoritos;
    next();
    
  } else {
    
    res.status(401).json({
      msg: "No estas autorizado para ingresar a esta página",
    })
  }
};

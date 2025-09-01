

const multer = require("multer");

const storage = multer.memoryStorage();

const tiposPermitidos = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/svg+xml",
  "image/avif",
];


const filtroDeArchivo = (req, file, cb) => {
  if (!tiposPermitidos.includes(file.mimetype)) {
    cb(
      new Error(
        "Tipo de archivo no permitido. Solo JPG, PNG, WEBP, SVG o AVIF."
      ),
      false
    );
    return;
  }
  cb(null, true);
};



const upload = multer({
  storage,
  fileFilter: filtroDeArchivo,
  limits: { fileSize: 2 * 1024 * 1024 }, // Límite: 2MB
});

module.exports = upload;

// Configuración centralizada de profesores, días (0=Dom ... 6=Sab) y hora base
// Ajustar aquí para mantener una sola fuente de verdad
const PROFESORES_HORARIOS = {
  andres: {
    dias: [1, 3], // Lunes, Miércoles
    hora: "08:00",
    nombre: "Andrés",
  },
  walter: {
    dias: [2, 4], // Martes, Jueves
    hora: "14:00",
    nombre: "Walter",
  },
  daniela: {
    dias: [5, 6], // Viernes, Sábado
    hora: "20:00",
    nombre: "Daniela",
  },
};

module.exports = { PROFESORES_HORARIOS };

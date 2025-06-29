const Reserva = require("../models/reserva.model");

const crearReservaService = async (datos) => {
  const nuevaReserva = new Reserva(datos);
  return await nuevaReserva.save();
};

const obtenerReservasService = async () => {
  return await Reserva.find().sort({ fecha: 1 });
};

const cancelarReservaService = async (id) => {
  return await Reserva.findByIdAndDelete(id);
};

module.exports = {
  crearReservaService,
  obtenerReservasService,
  cancelarReservaService,
};

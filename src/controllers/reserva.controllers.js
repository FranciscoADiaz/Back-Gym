const {
  crearReservaService,
  obtenerReservasService,
  cancelarReservaService,
} = require("../services/reserva.services");

const crearReserva = async (req, res) => {
  try {
    const reserva = await crearReservaService(req.body);
    res.status(201).json({ msg: "Reserva creada con éxito", reserva });
  } catch (error) {
    res.status(500).json({ msg: "Error al crear reserva", error });
  }
};

const obtenerReservas = async (req, res) => {
  try {
    const reservas = await obtenerReservasService();
    res.status(200).json(reservas);
  } catch (error) {
    res.status(500).json({ msg: "Error al obtener reservas", error });
  }
};

const cancelarReserva = async (req, res) => {
  try {
    await cancelarReservaService(req.params.id);
    res.status(200).json({ msg: "Reserva cancelada" });
  } catch (error) {
    res.status(500).json({ msg: "Error al cancelar reserva", error });
  }
};

module.exports = {
  crearReserva,
  obtenerReservas,
  cancelarReserva,
};

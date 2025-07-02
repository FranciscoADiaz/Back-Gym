const {
  crearReservaService,
  obtenerReservasService,
  cancelarReservaService,
  obtenerClasesDelDiaService,
} = require("../services/reserva.services");

const crearReserva = async (req, res) => {
  try {
    const reserva = await crearReservaService(req.body);
    res.status(201).json({ msg: "Reserva creada con éxito", reserva });
  } catch (error) {
    res.status(500).json({ msg: "Debes iniciar sesión para reservar", error });
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

const obtenerClasesDelDia = async (req, res) => {
  try {
    const clasesDelDia = await obtenerClasesDelDiaService();
    res.status(200).json(clasesDelDia);
  } catch (error) {
    console.error("⛔ Error al obtener las clases del día:", error);
    res.status(500).json({
      msg: "Error al obtener las clases del día",
      error: error.message || error,
    });
  }
};


module.exports = {
  crearReserva,
  obtenerReservas,
  cancelarReserva,
  obtenerClasesDelDia,
};

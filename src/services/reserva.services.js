const Reserva = require("../models/reserva.model");
const Usuarios = require("../models/usuarios.model");

// ✅ Guarda la reserva con la fecha y hora reales al momento de crear
const crearReservaService = async (datos) => {
  const nuevaReserva = new Reserva({
    ...datos,
    fecha: new Date(), // ahora mismo
  });
  return await nuevaReserva.save();
};

const obtenerReservasService = async () => {
  return await Reserva.find().sort({ fecha: 1 });
};

const cancelarReservaService = async (id) => {
  return await Reserva.findByIdAndDelete(id);
};

const obtenerClasesDelDiaService = async () => {
  const ahora = new Date();

  // 🔧 Rango para hoy usando hora local (del servidor, UTC-3 si está en Argentina)
  const hoyLocal = new Date(
    ahora.getFullYear(),
    ahora.getMonth(),
    ahora.getDate()
  );
  const mananaLocal = new Date(hoyLocal);
  mananaLocal.setDate(hoyLocal.getDate() + 1);

  // 🔍 Busca reservas entre 00:00 y 23:59 del día actual
  const reservasHoy = await Reserva.find({
    fecha: { $gte: hoyLocal, $lt: mananaLocal },
  }).populate("idUsuario", "nombreUsuario");

  const clasesAgrupadas = {};

  reservasHoy.forEach((reserva) => {
    const key = `${reserva.tipoClase}-${reserva.profesor}-${reserva.hora}`;

    if (!clasesAgrupadas[key]) {
      clasesAgrupadas[key] = {
        tipoClase: reserva.tipoClase,
        profesor: reserva.profesor,
        hora: reserva.hora,
        fecha: reserva.fecha,
        usuarios: [],
      };
    }

    clasesAgrupadas[key].usuarios.push({
      nombreUsuario: reserva.idUsuario?.nombreUsuario || "Sin nombre",
    });
  });

  return Object.values(clasesAgrupadas);
};

module.exports = {
  crearReservaService,
  obtenerReservasService,
  cancelarReservaService,
  obtenerClasesDelDiaService,
};

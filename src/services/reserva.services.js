const Reserva = require("../models/reserva.model");
const Usuarios = require("../models/usuarios.model");


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


const obtenerClasesDelDiaService = async () => {
  const ahora = new Date();

  // 🔧 Creamos los rangos usando UTC
  const hoyUTC = new Date(
    Date.UTC(ahora.getUTCFullYear(), ahora.getUTCMonth(), ahora.getUTCDate())
  );
  const mananaUTC = new Date(hoyUTC);
  mananaUTC.setUTCDate(hoyUTC.getUTCDate() + 1);

  // 🔍 Buscamos reservas entre 00:00 y 23:59 UTC del día actual
  const reservasHoy = await Reserva.find({
    fecha: { $gte: hoyUTC, $lt: mananaUTC },
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

const Reserva = require("../models/reserva.model");
const Usuarios = require("../models/usuarios.model");

const crearReservaService = async (datos) => {
  const nuevaReserva = new Reserva({
    ...datos,
    fechaCreacion: new Date(),
  });
  return await nuevaReserva.save();
};

const obtenerReservasService = async (idUsuario = null) => {
  if (idUsuario) {
    // Obtener reservas del usuario específico
    return await Reserva.find({
      idUsuario,
      estado: "activa",
    }).sort({ fecha: 1, hora: 1 });
  } else {
    // Obtener todas las reservas (para admin)
    return await Reserva.find()
      .populate("idUsuario", "nombreUsuario emailUsuario")
      .sort({ fecha: 1, hora: 1 });
  }
};

const cancelarReservaService = async (id, idUsuario, rolUsuario) => {
  try {
    const reserva = await Reserva.findById(id);

    if (!reserva) {
      return {
        error: true,
        statusCode: 404,
        msg: "Reserva no encontrada",
      };
    }

    // Solo el usuario propietario o un admin puede cancelar
    if (rolUsuario !== "admin" && reserva.idUsuario.toString() !== idUsuario) {
      return {
        error: true,
        statusCode: 403,
        msg: "No tienes permisos para cancelar esta reserva",
      };
    }

    // Cambiar estado a cancelada
    reserva.estado = "cancelada";
    await reserva.save();

    return {
      error: false,
      statusCode: 200,
      msg: "Reserva cancelada exitosamente",
    };
  } catch (error) {
    return {
      error: true,
      statusCode: 500,
      msg: "Error interno del servidor",
    };
  }
};

const obtenerClasesDelDiaService = async () => {
  const ahora = new Date();

  const hoyLocal = new Date(
    ahora.getFullYear(),
    ahora.getMonth(),
    ahora.getDate()
  );
  const mananaLocal = new Date(hoyLocal);
  mananaLocal.setDate(hoyLocal.getDate() + 1);

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

const verificarCuposService = async (
  fecha,
  hora,
  tipoClase,
  idUsuario = null
) => {
  try {
    // Cupo máximo por clase (configurable)
    const CUPO_MAXIMO = 15;

    // Verificar si el usuario ya tiene una reserva para esta clase
    let reservaExistente = false;
    if (idUsuario) {
      const reservaUsuario = await Reserva.findOne({
        idUsuario,
        fecha,
        hora,
        tipoClase,
        estado: "activa",
      });
      reservaExistente = !!reservaUsuario;
    }

    // Contar reservas activas para esa fecha, hora y tipo de clase
    const cuposOcupados = await Reserva.countDocuments({
      fecha,
      hora,
      tipoClase,
      estado: "activa",
    });

    const cuposDisponibles = Math.max(0, CUPO_MAXIMO - cuposOcupados);

    return {
      cuposDisponibles,
      cupoMaximo: CUPO_MAXIMO,
      cuposOcupados,
      reservaExistente,
    };
  } catch (error) {
    throw error;
  }
};

const obtenerReservasPorFechaService = async (fecha) => {
  try {
    const reservas = await Reserva.find({
      fecha,
      estado: "activa",
    })
      .populate("idUsuario", "nombreUsuario emailUsuario")
      .sort({ hora: 1, tipoClase: 1 });

    return reservas;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  crearReservaService,
  obtenerReservasService,
  cancelarReservaService,
  obtenerClasesDelDiaService,
  verificarCuposService,
  obtenerReservasPorFechaService,
};

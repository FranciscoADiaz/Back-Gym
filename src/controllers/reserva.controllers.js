const {
  crearReservaService,
  obtenerReservasService,
  cancelarReservaService,
  obtenerClasesDelDiaService,
  obtenerClasesProximosDiasService,
  obtenerTodasLasReservasAdminService,
  verificarCuposService,
  obtenerReservasPorFechaService,
} = require("../services/reserva.services");
const { PROFESORES_HORARIOS } = require("../config/profesores.config");

const crearReserva = async (req, res) => {
  try {
    const { fecha, hora, tipoClase, profesor, idUsuario } = req.body;

    // Validaciones básicas
    if (!fecha || !hora || !tipoClase || !profesor || !idUsuario) {
      return res.status(400).json({
        success: false,
        msg: "Todos los campos son requeridos",
      });
    }

    // Validar que el día de la semana coincida con el del profesor
    const { PROFESORES_HORARIOS } = require("../config/profesores.config");

    // fecha viene como YYYY-MM-DD (string)
    const parts = String(fecha)
      .split("-")
      .map((v) => parseInt(v, 10));
    const fechaLocal = new Date(parts[0], parts[1] - 1, parts[2]);
    const dow = fechaLocal.getDay();

    if (!PROFESORES_HORARIOS[profesor]?.dias.includes(dow)) {
      return res.status(400).json({
        success: false,
        msg: "El profesor seleccionado no trabaja el día elegido",
      });
    }

    // Verificar que no exista una reserva duplicada
    const reservaExistente = await verificarCuposService(
      fecha,
      hora,
      tipoClase,
      idUsuario
    );

    if (reservaExistente.reservaExistente) {
      return res.status(400).json({
        success: false,
        msg: "Ya tienes una reserva para esta clase en esta fecha y hora",
      });
    }

    if (reservaExistente.cuposDisponibles <= 0) {
      return res.status(400).json({
        success: false,
        msg: "No hay cupos disponibles para esta clase",
      });
    }

    const reserva = await crearReservaService(req.body);
    res.status(201).json({
      success: true,
      msg: "Reserva creada con éxito",
      reserva,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: "Error al crear reserva",
      error,
    });
  }
};

const obtenerReservas = async (req, res) => {
  try {
    const { rolUsuario, idUsuario } = req.usuario;

    if (rolUsuario === "admin") {
      // Admin ve todas las reservas
      const reservas = await obtenerReservasService();
      res.status(200).json({
        success: true,
        reservas,
      });
    } else {
      // Usuario común ve solo sus reservas
      const reservas = await obtenerReservasService(req.idUsuario);
      res.status(200).json({
        success: true,
        reservas,
      });
    }
  } catch (error) {
    console.error("Error al obtener reservas:", error);
    res.status(500).json({
      success: false,
      msg: "Error al obtener reservas",
      error: error.message || error,
    });
  }
};

const cancelarReserva = async (req, res) => {
  try {
    const { id } = req.params;
    const { rolUsuario } = req.usuario;

    const reserva = await cancelarReservaService(id, req.idUsuario, rolUsuario);

    if (reserva.error) {
      return res.status(reserva.statusCode).json({
        success: false,
        msg: reserva.msg,
      });
    }

    res.status(200).json({
      success: true,
      msg: "Reserva cancelada exitosamente",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: "Error al cancelar reserva",
      error,
    });
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

const obtenerClasesProximosDias = async (req, res) => {
  try {
    const { dias = 7 } = req.query;
    const clasesProximosDias = await obtenerClasesProximosDiasService(
      parseInt(dias)
    );
    res.status(200).json(clasesProximosDias);
  } catch (error) {
    console.error(
      "⛔ Error al obtener las clases de los próximos días:",
      error
    );
    res.status(500).json({
      msg: "Error al obtener las clases de los próximos días",
      error: error.message || error,
    });
  }
};

const obtenerTodasLasReservasAdmin = async (req, res) => {
  try {
    const todasLasReservas = await obtenerTodasLasReservasAdminService();
    res.status(200).json(todasLasReservas);
  } catch (error) {
    console.error("⛔ Error al obtener todas las reservas:", error);
    res.status(500).json({
      msg: "Error al obtener todas las reservas",
      error: error.message || error,
    });
  }
};

const verificarCupos = async (req, res) => {
  try {
    const { fecha, hora, tipoClase } = req.query;

    if (!fecha || !hora || !tipoClase) {
      return res.status(400).json({
        success: false,
        msg: "Fecha, hora y tipo de clase son requeridos",
      });
    }

    const cupos = await verificarCuposService(fecha, hora, tipoClase);
    res.status(200).json({
      success: true,
      ...cupos,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: "Error al verificar cupos",
      error,
    });
  }
};

const obtenerReservasPorFecha = async (req, res) => {
  try {
    const { fecha } = req.params;
    const { rolUsuario } = req.usuario;

    if (rolUsuario !== "admin") {
      return res.status(403).json({
        success: false,
        msg: "Acceso denegado",
      });
    }

    const reservas = await obtenerReservasPorFechaService(fecha);
    res.status(200).json({
      success: true,
      reservas,
    });
  } catch (error) {
    console.error("Error al obtener reservas por fecha:", error);
    res.status(500).json({
      success: false,
      msg: "Error al obtener reservas por fecha",
      error: error.message || error,
    });
  }
};

const obtenerReservasUsuario = async (req, res) => {
  try {
    const { idUsuario } = req.params;
    const { rolUsuario } = req.usuario;

    // Verificar que el usuario solo pueda ver sus propias reservas
    if (rolUsuario === "usuario" && req.idUsuario !== idUsuario) {
      return res.status(403).json({
        success: false,
        msg: "No tienes permisos para ver las reservas de otro usuario",
      });
    }

    const reservas = await obtenerReservasService(idUsuario);
    res.status(200).json({
      success: true,
      reservas,
    });
  } catch (error) {
    console.error("Error al obtener reservas del usuario:", error);
    res.status(500).json({
      success: false,
      msg: "Error al obtener reservas del usuario",
      error: error.message || error,
    });
  }
};

module.exports = {
  crearReserva,
  obtenerReservas,
  obtenerReservasUsuario,
  cancelarReserva,
  obtenerClasesDelDia,
  obtenerClasesProximosDias,
  obtenerTodasLasReservasAdmin,
  verificarCupos,
  obtenerReservasPorFecha,
  obtenerProfesoresHorarios: (req, res) => {
    res.status(200).json({ success: true, data: PROFESORES_HORARIOS });
  },
};

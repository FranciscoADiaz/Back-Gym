const Clase = require("../models/clases.model.js");

// GET - Obtener todas las clases
const obtenerTodasLasClases = async (req, res) => {
  try {
    const clases = await Clase.find({ estado: { $ne: "inactiva" } }).sort({
      fechaCreacion: -1,
    });

    res.status(200).json({
      success: true,
      data: clases,
      message: "Clases obtenidas exitosamente",
    });
  } catch (error) {
    console.error("Error al obtener clases:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor al obtener clases",
    });
  }
};

// GET - Obtener clase por ID
const obtenerClasePorId = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "ID de clase es requerido",
      });
    }

    const clase = await Clase.findById(id);

    if (!clase) {
      return res.status(404).json({
        success: false,
        message: "Clase no encontrada",
      });
    }

    res.status(200).json({
      success: true,
      data: clase,
      message: "Clase obtenida exitosamente",
    });
  } catch (error) {
    console.error("Error al obtener clase:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor al obtener clase",
    });
  }
};

// GET - Obtener clases por tipo
const obtenerClasesPorTipo = async (req, res) => {
  try {
    const { tipoClase } = req.params;

    if (!tipoClase) {
      return res.status(400).json({
        success: false,
        message: "Tipo de clase es requerido",
      });
    }

    const clases = await Clase.find({
      tipoClase: tipoClase,
      estado: { $ne: "inactiva" },
    }).sort({ fechaCreacion: -1 });

    res.status(200).json({
      success: true,
      data: clases,
      message: `Clases de tipo ${tipoClase} obtenidas exitosamente`,
    });
  } catch (error) {
    console.error("Error al obtener clases por tipo:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor al obtener clases por tipo",
    });
  }
};

// GET - Obtener clases por profesor
const obtenerClasesPorProfesor = async (req, res) => {
  try {
    const { profesor } = req.params;

    if (!profesor) {
      return res.status(400).json({
        success: false,
        message: "Profesor es requerido",
      });
    }

    const clases = await Clase.find({
      profesor: profesor,
      estado: { $ne: "inactiva" },
    }).sort({ fechaCreacion: -1 });

    res.status(200).json({
      success: true,
      data: clases,
      message: `Clases del profesor ${profesor} obtenidas exitosamente`,
    });
  } catch (error) {
    console.error("Error al obtener clases por profesor:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor al obtener clases por profesor",
    });
  }
};

// POST - Crear nueva clase
const crearClase = async (req, res) => {
  try {
    const {
      nombre,
      descripcion,
      tipoClase,
      profesor,
      capacidad,
      duracion,
      horarios,
      precio,
      imagen,
    } = req.body;

    // Validaciones básicas
    if (
      !nombre ||
      !descripcion ||
      !tipoClase ||
      !profesor ||
      !capacidad ||
      !duracion ||
      !horarios ||
      !precio
    ) {
      return res.status(400).json({
        success: false,
        message: "Todos los campos obligatorios son requeridos",
      });
    }

    // Validar que horarios sea un array y tenga al menos un horario
    if (!Array.isArray(horarios) || horarios.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Debe proporcionar al menos un horario",
      });
    }

    // Validar cada horario
    for (const horario of horarios) {
      if (!horario.dia || !horario.hora) {
        return res.status(400).json({
          success: false,
          message: "Cada horario debe tener día y hora",
        });
      }
    }

    const nuevaClase = new Clase({
      nombre,
      descripcion,
      tipoClase,
      profesor,
      capacidad,
      duracion,
      horarios,
      precio,
      imagen: imagen || "",
    });

    const claseGuardada = await nuevaClase.save();

    res.status(201).json({
      success: true,
      data: claseGuardada,
      message: "Clase creada exitosamente",
    });
  } catch (error) {
    console.error("Error al crear clase:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Datos de clase inválidos",
        errors: Object.values(error.errors).map((err) => err.message),
      });
    }

    res.status(500).json({
      success: false,
      message: "Error interno del servidor al crear clase",
    });
  }
};

// PUT - Actualizar clase
const actualizarClase = async (req, res) => {
  try {
    const { id } = req.params;
    const datosActualizados = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "ID de clase es requerido",
      });
    }

    // Validar que la clase existe
    const claseExistente = await Clase.findById(id);
    if (!claseExistente) {
      return res.status(404).json({
        success: false,
        message: "Clase no encontrada",
      });
    }

    // Si se están actualizando horarios, validar que sea un array válido
    if (datosActualizados.horarios) {
      if (
        !Array.isArray(datosActualizados.horarios) ||
        datosActualizados.horarios.length === 0
      ) {
        return res.status(400).json({
          success: false,
          message: "Debe proporcionar al menos un horario",
        });
      }

      for (const horario of datosActualizados.horarios) {
        if (!horario.dia || !horario.hora) {
          return res.status(400).json({
            success: false,
            message: "Cada horario debe tener día y hora",
          });
        }
      }
    }

    // Actualizar fecha de actualización
    datosActualizados.fechaActualizacion = Date.now();

    const claseActualizada = await Clase.findByIdAndUpdate(
      id,
      datosActualizados,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: claseActualizada,
      message: "Clase actualizada exitosamente",
    });
  } catch (error) {
    console.error("Error al actualizar clase:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Datos de clase inválidos",
        errors: Object.values(error.errors).map((err) => err.message),
      });
    }

    res.status(500).json({
      success: false,
      message: "Error interno del servidor al actualizar clase",
    });
  }
};

// DELETE - Eliminar clase (cambiar estado a inactiva)
const eliminarClase = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "ID de clase es requerido",
      });
    }

    // Validar que la clase existe
    const claseExistente = await Clase.findById(id);
    if (!claseExistente) {
      return res.status(404).json({
        success: false,
        message: "Clase no encontrada",
      });
    }

    // Cambiar estado a inactiva en lugar de eliminar físicamente
    const claseEliminada = await Clase.findByIdAndUpdate(
      id,
      {
        estado: "inactiva",
        fechaActualizacion: Date.now(),
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      data: claseEliminada,
      message: "Clase eliminada exitosamente",
    });
  } catch (error) {
    console.error("Error al eliminar clase:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor al eliminar clase",
    });
  }
};

// PATCH - Cambiar estado de clase
const cambiarEstadoClase = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "ID de clase es requerido",
      });
    }

    if (!estado || !["activa", "inactiva", "suspendida"].includes(estado)) {
      return res.status(400).json({
        success: false,
        message: "Estado válido es requerido (activa, inactiva, suspendida)",
      });
    }

    // Validar que la clase existe
    const claseExistente = await Clase.findById(id);
    if (!claseExistente) {
      return res.status(404).json({
        success: false,
        message: "Clase no encontrada",
      });
    }

    const claseActualizada = await Clase.findByIdAndUpdate(
      id,
      {
        estado,
        fechaActualizacion: Date.now(),
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      data: claseActualizada,
      message: `Estado de clase cambiado a ${estado} exitosamente`,
    });
  } catch (error) {
    console.error("Error al cambiar estado de clase:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor al cambiar estado de clase",
    });
  }
};

// GET - Buscar clases (búsqueda por nombre, tipo, profesor)
const buscarClases = async (req, res) => {
  try {
    const { q, tipoClase, profesor, estado } = req.query;

    let filtro = {};

    // Filtro por término de búsqueda
    if (q) {
      filtro.nombre = { $regex: q, $options: "i" };
    }

    // Filtro por tipo de clase
    if (tipoClase) {
      filtro.tipoClase = tipoClase;
    }

    // Filtro por profesor
    if (profesor) {
      filtro.profesor = profesor;
    }

    // Filtro por estado
    if (estado) {
      filtro.estado = estado;
    } else {
      // Por defecto, no mostrar clases inactivas
      filtro.estado = { $ne: "inactiva" };
    }

    const clases = await Clase.find(filtro).sort({ fechaCreacion: -1 });

    res.status(200).json({
      success: true,
      data: clases,
      message: "Búsqueda de clases completada exitosamente",
    });
  } catch (error) {
    console.error("Error al buscar clases:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor al buscar clases",
    });
  }
};

module.exports = {
  obtenerTodasLasClases,
  obtenerClasePorId,
  obtenerClasesPorTipo,
  obtenerClasesPorProfesor,
  crearClase,
  actualizarClase,
  eliminarClase,
  cambiarEstadoClase,
  buscarClases,
};

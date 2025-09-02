const Plan = require("../models/planes.model.js");

// GET - Obtener todos los planes
const obtenerTodosLosPlanes = async (req, res) => {
  try {
    const planes = await Plan.find({ estado: { $ne: "inactivo" } }).sort({
      fechaCreacion: -1,
    });

    res.status(200).json({
      success: true,
      data: planes,
      message: "Planes obtenidos exitosamente",
    });
  } catch (error) {
    console.error("Error al obtener planes:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor al obtener planes",
    });
  }
};

// GET - Obtener plan por ID
const obtenerPlanPorId = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "ID de plan es requerido",
      });
    }

    const plan = await Plan.findById(id);

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: "Plan no encontrado",
      });
    }

    res.status(200).json({
      success: true,
      data: plan,
      message: "Plan obtenido exitosamente",
    });
  } catch (error) {
    console.error("Error al obtener plan:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor al obtener plan",
    });
  }
};

// GET - Obtener planes por tipo
const obtenerPlanesPorTipo = async (req, res) => {
  try {
    const { tipo } = req.params;

    if (!tipo) {
      return res.status(400).json({
        success: false,
        message: "Tipo de plan es requerido",
      });
    }

    const planes = await Plan.find({
      tipo: tipo,
      estado: { $ne: "inactivo" },
    }).sort({ fechaCreacion: -1 });

    res.status(200).json({
      success: true,
      data: planes,
      message: `Planes de tipo ${tipo} obtenidos exitosamente`,
    });
  } catch (error) {
    console.error("Error al obtener planes por tipo:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor al obtener planes por tipo",
    });
  }
};

// POST - Crear nuevo plan
const crearPlan = async (req, res) => {
  try {
    const {
      nombre,
      descripcion,
      tipo,
      precio,
      duracion,
      caracteristicas,
      imagen,
    } = req.body;

    // Validaciones básicas
    if (
      !nombre ||
      !descripcion ||
      !tipo ||
      !precio ||
      !duracion ||
      !caracteristicas
    ) {
      return res.status(400).json({
        success: false,
        message: "Todos los campos obligatorios son requeridos",
      });
    }

    // Validar que características sea un array y tenga al menos una característica
    if (!Array.isArray(caracteristicas) || caracteristicas.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Debe proporcionar al menos una característica",
      });
    }

    const nuevoPlan = new Plan({
      nombre,
      descripcion,
      tipo,
      precio,
      duracion,
      caracteristicas,
      imagen: imagen || "",
    });

    const planGuardado = await nuevoPlan.save();

    res.status(201).json({
      success: true,
      data: planGuardado,
      message: "Plan creado exitosamente",
    });
  } catch (error) {
    console.error("Error al crear plan:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Datos de plan inválidos",
        errors: Object.values(error.errors).map((err) => err.message),
      });
    }

    res.status(500).json({
      success: false,
      message: "Error interno del servidor al crear plan",
    });
  }
};

// PUT - Actualizar plan
const actualizarPlan = async (req, res) => {
  try {
    const { id } = req.params;
    const datosActualizados = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "ID de plan es requerido",
      });
    }

    // Validar que el plan existe
    const planExistente = await Plan.findById(id);
    if (!planExistente) {
      return res.status(404).json({
        success: false,
        message: "Plan no encontrado",
      });
    }

    // Si se están actualizando características, validar que sea un array válido
    if (datosActualizados.caracteristicas) {
      if (
        !Array.isArray(datosActualizados.caracteristicas) ||
        datosActualizados.caracteristicas.length === 0
      ) {
        return res.status(400).json({
          success: false,
          message: "Debe proporcionar al menos una característica",
        });
      }
    }

    // Actualizar fecha de actualización
    datosActualizados.fechaActualizacion = Date.now();

    const planActualizado = await Plan.findByIdAndUpdate(
      id,
      datosActualizados,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: planActualizado,
      message: "Plan actualizado exitosamente",
    });
  } catch (error) {
    console.error("Error al actualizar plan:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Datos de plan inválidos",
        errors: Object.values(error.errors).map((err) => err.message),
      });
    }

    res.status(500).json({
      success: false,
      message: "Error interno del servidor al actualizar plan",
    });
  }
};

// DELETE - Eliminar plan (cambiar estado a inactivo)
const eliminarPlan = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "ID de plan es requerido",
      });
    }

    // Validar que el plan existe
    const planExistente = await Plan.findById(id);
    if (!planExistente) {
      return res.status(404).json({
        success: false,
        message: "Plan no encontrado",
      });
    }

    // Cambiar estado a inactivo en lugar de eliminar físicamente
    const planEliminado = await Plan.findByIdAndUpdate(
      id,
      {
        estado: "inactivo",
        fechaActualizacion: Date.now(),
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      data: planEliminado,
      message: "Plan eliminado exitosamente",
    });
  } catch (error) {
    console.error("Error al eliminar plan:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor al eliminar plan",
    });
  }
};

// PATCH - Cambiar estado de plan
const cambiarEstadoPlan = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "ID de plan es requerido",
      });
    }

    if (!estado || !["activo", "inactivo"].includes(estado)) {
      return res.status(400).json({
        success: false,
        message: "Estado válido es requerido (activo, inactivo)",
      });
    }

    // Validar que el plan existe
    const planExistente = await Plan.findById(id);
    if (!planExistente) {
      return res.status(404).json({
        success: false,
        message: "Plan no encontrado",
      });
    }

    const planActualizado = await Plan.findByIdAndUpdate(
      id,
      {
        estado,
        fechaActualizacion: Date.now(),
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      data: planActualizado,
      message: `Estado de plan cambiado a ${estado} exitosamente`,
    });
  } catch (error) {
    console.error("Error al cambiar estado de plan:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor al cambiar estado de plan",
    });
  }
};

// GET - Buscar planes
const buscarPlanes = async (req, res) => {
  try {
    const { q, tipo, estado } = req.query;

    let filtro = {};

    // Filtro por término de búsqueda
    if (q) {
      filtro.nombre = { $regex: q, $options: "i" };
    }

    // Filtro por tipo de plan
    if (tipo) {
      filtro.tipo = tipo;
    }

    // Filtro por estado
    if (estado) {
      filtro.estado = estado;
    } else {
      // Por defecto, no mostrar planes inactivos
      filtro.estado = { $ne: "inactivo" };
    }

    const planes = await Plan.find(filtro).sort({ fechaCreacion: -1 });

    res.status(200).json({
      success: true,
      data: planes,
      message: "Búsqueda de planes completada exitosamente",
    });
  } catch (error) {
    console.error("Error al buscar planes:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor al buscar planes",
    });
  }
};

module.exports = {
  obtenerTodosLosPlanes,
  obtenerPlanPorId,
  obtenerPlanesPorTipo,
  crearPlan,
  actualizarPlan,
  eliminarPlan,
  cambiarEstadoPlan,
  buscarPlanes,
};

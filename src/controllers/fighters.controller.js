import Fighters from "../models/fighters.model.js";

export const getFighters = async function (req, res) {
  try {
    const fighters = await Fighters.getFighters();
    res.json(fighters);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getFighterById = async (req, res) => {
  try {
    const { id } = req.params;
    const fighter = await Fighters.getFighterById(id);

    if (!fighter) {
      return res.status(404).json({ message: "Peleador no encontrado" });
    }

    res.json({ message: "Datos obtenidos con exito", fighter });
  } catch (error) {
    console.error("Error en getFightersById", error);
    res
      .status(500)
      .json({ message: `Error al obtener el peleador`, error: error.message });
  }
};

export const insertFighter = async (req, res) => {
  try {
    const { name, history, description, fighting_style, nationality } =
      req.body;

    const nuevoFighter = await Fighters.insertFighter({
      name,
      history,
      description,
      fighting_style,
      nationality,
    });

    return res.status(201).json({
      message: "El peleador fue ingresado con exito",
      data: nuevoFighter,
    });
  } catch (error) {
    console.error(`Error en insertFighter (controlador): ${error}`);
    res
      .status(500)
      .json({ message: `Error al insertar al peleador`, error: error.message });
  }
};

export const updateFighter = async (req, res) => {
  try {
    const { id } = req.params;
    const oldFighter = await Fighters.getFighterById(id);

    if (!oldFighter) {
      return res
        .status(404)
        .json({ message: `No se encontro al peleador con la ID: ${id}` });
    }

    const { name, history, description, fighting_style, nationality } =
      req.body;

    const newFighter = {
      name,
      history,
      description,
      fighting_style,
      nationality,
    };

    const updatedFighter = await Fighters.updateFighter(id, newFighter);

    return res.status(201).json({
      message: `El peleador ${updatedFighter.name} fue actualizado con exito`,
      data: newFighter,
    });
  } catch (error) {
    console.error(`Error en updateFighter (controlador): ${error}`);
    res.status(500).json({
      message: `Error al intentar actualizar al peleador`,
      error: error.message,
    });
  }
};

export const deleteFighter = async (req, res) => {
  try {
    const { id } = req.params;
    const oldFighter = await Fighters.getFighterById(id);

    if (!oldFighter) {
      return res
        .status(404)
        .json({ message: `No se encontro al peleador con la ID: ${id}` });
    }

    const oldFighterName = oldFighter.name;

    const deletedFighter = await Fighters.deleteFighter(id);

    return res.status(201).json({
      message: `El peleador ${oldFighterName} con la id: ${id} fue eliminado con exito`,
      data: deletedFighter,
    });
  } catch (error) {
    console.error(`Error en deleteFighter (controlador): ${error}`);
    res.status(500).json({
      message: `Error al intentar eliminar al peleador`,
      error: error.message,
    });
  }
};

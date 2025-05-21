import Fighters from "../models/fighters.model.js";
import FighterVersion from "../models/fighters_versions.model.js";
import FighterImage from "../models/fighter_images.model.js";
import { OkResponse, badResponse } from "../utils/responses.js";
import FighterMove from "../models/fighter_moves.model.js";
import { buildURL } from "../utils/buildURL.js";

export const getFighters = async function (req, res) {
  try {
    const fighters = await Fighters.getFighters();
    return OkResponse(
      res,
      "Consulta exitosa",
      "Peleadores obtenidos",
      200,
      fighters
    );
  } catch (error) {
    return badResponse(
      res,
      "Error en getFighters",
      "No se pudieron obtener los peleadores",
      500,
      error.message
    );
  }
};

export const getFighterById = async (req, res) => {
  try {
    const { id } = req.params;
    const fighter = await Fighters.getFighterById(id);

    if (!fighter) {
      return badResponse(
        res,
        "No encontrado",
        "Peleador no encontrado",
        404,
        null
      );
    }

    return OkResponse(
      res,
      "Consulta exitosa",
      "Datos obtenidos con éxito",
      200,
      fighter
    );
  } catch (error) {
    return badResponse(
      res,
      "Error en getFighterById",
      "Error al obtener el peleador",
      500,
      error.message
    );
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

    return OkResponse(
      res,
      "Inserción exitosa",
      "El peleador fue ingresado con éxito",
      201,
      nuevoFighter
    );
  } catch (error) {
    return badResponse(
      res,
      "Error en insertFighter",
      "Error al insertar al peleador",
      500,
      error.message
    );
  }
};

export const updateFighter = async (req, res) => {
  try {
    const { id } = req.params;
    const oldFighter = await Fighters.getFighterById(id);

    if (!oldFighter) {
      return badResponse(
        res,
        "No encontrado",
        `No se encontró al peleador con la ID: ${id}`,
        404,
        null
      );
    }

    const { name, history, description, fighting_style, nationality } =
      req.body;

    const updatedFighter = await Fighters.updateFighter(id, {
      name,
      history,
      description,
      fighting_style,
      nationality,
    });

    return OkResponse(
      res,
      "Actualización exitosa",
      `El peleador ${updatedFighter.name} fue actualizado con éxito`,
      200,
      updatedFighter
    );
  } catch (error) {
    return badResponse(
      res,
      "Error en updateFighter",
      "Error al intentar actualizar al peleador",
      500,
      error.message
    );
  }
};

export const deleteFighter = async (req, res) => {
  try {
    const { id } = req.params;
    const oldFighter = await Fighters.getFighterById(id);

    if (!oldFighter) {
      return badResponse(
        res,
        "No encontrado",
        `No se encontró al peleador con la ID: ${id}`,
        404,
        null
      );
    }

    const oldFighterName = oldFighter.name;
    const deletedFighter = await Fighters.deleteFighter(id);

    return OkResponse(
      res,
      "Eliminación exitosa",
      `El peleador ${oldFighterName} con la id: ${id} fue eliminado con éxito`,
      200,
      deletedFighter
    );
  } catch (error) {
    return badResponse(
      res,
      "Error en deleteFighter",
      "Error al intentar eliminar al peleador",
      500,
      error.message
    );
  }
};

export const getFighterDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const fighter = await Fighters.findByPk(id, {
      include: [
        {
          model: FighterVersion,
          as: "versions",
          include: [
            {
              model: FighterImage,
              as: "images",
            },
            { model: FighterMove, as: "moves" },
          ],
        },
      ],
    });

    if (!fighter) {
      return badResponse(
        res,
        "No encontrado",
        "Peleador no encontrado",
        404,
        null
      );
    }

    let jsonFighter = fighter.toJSON();

    jsonFighter.versions.forEach((version) => {
      version.images.forEach((image) => {
        image.imageUrl = buildURL(req, image.image);
      });

      version.moves.forEach((move) => {
        if (move.img_command)
          move.img_command_url = buildURL(req, move.img_command);
        if (move.img_execution)
          move.img_execution_url = buildURL(req, move.img_execution);
      });
    });

    return OkResponse(
      res,
      "Consulta exitosa",
      "Detalles del peleador obtenidos",
      200,
      jsonFighter
    );
  } catch (error) {
    return badResponse(
      res,
      "Error en getFighterDetails",
      "Error al obtener el peleador",
      500,
      error.message
    );
  }
};

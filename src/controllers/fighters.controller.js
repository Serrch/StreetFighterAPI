import Fighters from "../models/fighters.model.js";
import FighterVersion from "../models/fighters_versions.model.js";
import FighterImage from "../models/fighter_images.model.js";
import {
  OkResponse,
  exceptionResponseControl,
  notFoundByIdResponse,
} from "../utils/responses.js";
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
    console.log(`Ocurrio un error en getFighters (controlador): ${error}`);
    return exceptionResponseControl(res, "getFighters", error.message);
  }
};

export const getFighterById = async (req, res) => {
  try {
    const { id } = req.params;
    const fighter = await Fighters.getFighterById(id);

    if (!fighter) return notFoundByIdResponse(res, "getFighterById", id);

    return OkResponse(
      res,
      "Consulta exitosa",
      "Datos obtenidos con éxito",
      200,
      fighter
    );
  } catch (error) {
    console.error("Error en getFighterById", error);
    return exceptionResponseControl(res, "getFighterById", error.message);
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
    console.log(`Error en insertFighter (controlador): ${error}`);
    return exceptionResponseControl(res, "insertFighter", error.message);
  }
};

export const updateFighter = async (req, res) => {
  try {
    const { id } = req.params;
    const oldFighter = await Fighters.getFighterById(id);

    if (!oldFighter) return notFoundByIdResponse(res, "updateFighter", id);

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
    console.error(`Error en updateFighter (controlador): ${error.message}`);
    return exceptionResponseControl(res, "updateFighter", error.message);
  }
};

export const deleteFighter = async (req, res) => {
  try {
    const { id } = req.params;
    const oldFighter = await Fighters.getFighterById(id);

    if (!oldFighter) return notFoundByIdResponse(res, "deleteFighter", id);

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
    console.error(`Error en deleteFighter (controlador): ${error.message}`);
    return exceptionResponseControl(res, "deleteFighter", error.message);
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

    if (!fighter) return notFoundByIdResponse(res, "getFighterDetails", id);
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
    console.error(`Error en getFighterDetails (controlador): ${error.message}`);
    return exceptionResponseControl(res, "getFighterDetails", error.message);
  }
};

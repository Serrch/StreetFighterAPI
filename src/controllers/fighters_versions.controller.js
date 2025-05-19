import FighterVersion from "../models/fighters_versions.model.js";
import { OkResponse, badResponse } from "../utils/responses.js";
import { existId } from "../utils/exists_ids.js";

export const getFighterVersion = async function (req, res) {
  try {
    const fighterVersion = await FighterVersion.getFighterVersion();

    if (!fighterVersion) {
      return badResponse(
        res,
        "No se obtuvieron las versiones",
        "Ocurrio un error al obtener las versiones",
        404,
        fighterVersion || null
      );
    }

    return OkResponse(
      res,
      "Version obtenida con exito",
      `La version fue obtenida con exito`,
      200,
      fighterVersion
    );
  } catch (error) {
    return badResponse(
      res,
      "Ocurrio una excepcion al obtener las versiones",
      "Excepcion del lado del controlador",
      500,
      error.message
    );
  }
};

export const getFighterVersionById = async (req, res) => {
  try {
    const { id } = req.params;
    const fighterVersion = await FighterVersion.getFighterVersionById(id);

    if (!fighterVersion) {
      return badResponse(
        res,
        "Version no encontrada",
        `No hay una version para la id ${id}`,
        404,
        null
      );
    }
    return OkResponse(
      res,
      "Version obtenida con exito",
      `Se obtuvo con exito la version`,
      200,
      fighterVersion
    );
  } catch (error) {
    console.error("Error en getFightersById", error);
    return badResponse(
      res,
      "Ocurrio una excepcion al obtener la version",
      "Excepcion del lado del controlador",
      500,
      error.message
    );
  }
};

export const insertFighterVersion = async (req, res) => {
  try {
    const { id_fighter, id_game, version_name, description } = req.body;

    const existIdFighter = await existId("fighters", id_fighter);
    const existIdGame = await existId("games", id_game);
    if (!existIdFighter)
      return badResponse(
        res,
        "No se encontro la id_fighter",
        `La id ${id_fighter} no corresponde a algun fighter`,
        404,
        null
      );

    if (!existIdGame)
      return badResponse(
        res,
        "No se encontro la id_game",
        `La id ${id_game} no corresponde a algun juego`,
        404,
        null
      );

    const newFighterVersion = await FighterVersion.insertFighterVersion({
      id_fighter,
      id_game,
      version_name,
      description,
    });

    return OkResponse(
      res,
      `Version guardada`,
      `La version, fue guardada con exito`,
      201,
      newFighterVersion
    );
  } catch (error) {
    console.error(`Error en insertFighterVersion (controlador): ${error}`);
    res
      .status(500)
      .json({ message: `Error al insertar al peleador`, error: error.message });
  }
};

export const updateFighterVersion = async (req, res) => {
  try {
    const { id } = req.params;
    const oldFighterVersion = await FighterVersion.getFighterVersionById(id);

    if (!oldFighterVersion) {
      return badResponse(
        res,
        "Version no encontrada",
        `No se encontro la version con la ID: ${id}`,
        404,
        null
      );
    }

    const {
      id_fighter_version,
      id_fighter,
      id_game,
      version_name,
      description,
    } = req.body;

    const existIdFighter = await existId("fighters", id_fighter);
    const existIdGame = await existId("games", id_game);
    if (!existIdFighter)
      return badResponse(
        res,
        "No se encontro la id_fighter",
        `La id ${id_fighter} no corresponde a algun fighter`,
        404,
        null
      );

    if (!existIdGame)
      return badResponse(
        res,
        "No se encontro la id_game",
        `La id ${id_game} no corresponde a algun juego`,
        404,
        null
      );

    const newFighterVersion = {
      id_fighter_version,
      id_fighter,
      id_game,
      version_name,
      description,
    };

    const updatedFighterVersion = await FighterVersion.updateFighterVersion(
      id,
      newFighterVersion
    );

    return OkResponse(
      res,
      `Version actualizada con exito`,
      `La version, fue actualizada con exito`,
      200,
      updatedFighterVersion
    );
  } catch (error) {
    console.error(`Error en updateFighter (controlador): ${error}`);
    return badResponse(
      res,
      `Excepcion al intentar actualizar`,
      `Ocurrio una excepcion al intentar actualizar`,
      500,
      error.message
    );
  }
};

export const deleteFighterVersion = async (req, res) => {
  try {
    const { id } = req.params;
    const oldFighterVersion = await FighterVersion.getFighterVersionById(id);

    if (!oldFighterVersion) {
      return badResponse(
        res,
        `Version no encontrada`,
        `No se encontro al peleador con la ID: ${id}`,
        404,
        null
      );
    }

    const oldFighterVersionId = oldFighterVersion.id_fighter_version;

    const deletedFighterVersion = await FighterVersion.deleteFighterVersion(id);

    return OkResponse(
      res,
      `Version eliminada con exito`,
      `La version fue eliminada con exito`,
      200,
      deletedFighterVersion
    );
  } catch (error) {
    console.error(`Error en deleteFighter (controlador): ${error}`);
    return badResponse(
      res,
      `Excepcion al eliminar una version`,
      `Ocurrio un error al eliminar la version`,
      500,
      error.message
    );
  }
};

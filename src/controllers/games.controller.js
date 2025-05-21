import Games from "../models/games.model.js";
import {
  OkResponse,
  badResponse,
  deleteOldImageErrorResponse,
  emptyImages,
  exceptionResponseControl,
  notFoundByIdResponse,
} from "../utils/responses.js";
import { deleteImgPath } from "../utils/delete_img_path.js";
import { buildURL } from "../utils/buildURL.js";
import { saveImgBuffer } from "../utils/save_img_buffer.js";

export const getGames = async (req, res) => {
  try {
    const games = await Games.getGames();

    const gamesWithPublicUrl = games.map((game) => {
      return {
        id_game: game.id_game,
        title: game.title,
        description: game.description,
        year: game.year,
        img_logo: game.img_logo,
        short_title: game.short_title,
        urlImgLogo: buildURL(req, game.img_logo),
      };
    });

    return OkResponse(
      res,
      "Juegos obtenidos con exito",
      "Todos los juegos obtenidos con exito",
      200,
      gamesWithPublicUrl
    );
  } catch (error) {
    console.log(`Ocurrio un error en getGames (controlador): ${error}`);
    return exceptionResponseControl(res, "getGames", error.message);
  }
};

export const getGameById = async (req, res) => {
  try {
    const { id } = req.params;
    const game = await Games.getGameById(id);

    if (!game) return notFoundByIdResponse(res, "getGameById", id);

    let jsonResponse = game.toJSON();
    jsonResponse.urlImgLogo = buildURL(req, jsonResponse.img_logo);

    return OkResponse(
      res,
      "Datos obtenidos con exito",
      `El juego ${jsonResponse.title} se obtuvo con exito `,
      200,
      jsonResponse
    );
  } catch (error) {
    console.error("Error en getGameById", error);
    return exceptionResponseControl(res, "getGameById", error.message);
  }
};

export const insertGame = async (req, res) => {
  try {
    const { title, description, year, short_title } = req.body;
    const fileImgLogo = req.files?.img_logo?.[0];

    if (!fileImgLogo) return emptyImages(res, ["img_logo"], "insertGame");

    const relativePath = await saveImgBuffer(req, fileImgLogo, false);

    const img_logo = relativePath;

    const newGame = await Games.insertGame({
      title,
      description,
      year,
      img_logo,
      short_title,
    });

    let jsonResponse = newGame.toJSON();
    jsonResponse.urlImgLogo = buildURL(req, img_logo);

    return OkResponse(
      res,
      "Juego creado con éxito",
      `El juego ${newGame.title} fue ingresado con éxito`,
      201,
      jsonResponse
    );
  } catch (error) {
    console.log(`Error en insertGame (controlador): ${error}`);
    return exceptionResponseControl(res, "insertGame", error.message);
  }
};

export const updateGame = async (req, res) => {
  let oldGame = null;

  try {
    const { id } = req.params;
    oldGame = await Games.getGameById(id);

    if (!oldGame) return notFoundByIdResponse(res, "updateGame", id);

    const { title, description, year, short_title } = req.body;
    const fileImgLogo = req.files.img_logo?.[0];

    if (!fileImgLogo) return emptyImages(res, ["img_logo"], "updateGame");

    const resDeleteImg = await deleteImgPath(oldGame.img_logo);

    if (resDeleteImg?.value === false)
      return deleteOldImageErrorResponse(
        res,
        "updateGame",
        resDeleteImg.message
      );

    const relativePath = await saveImgBuffer(req, fileImgLogo, false);

    const img_logo = relativePath;

    const newGame = {
      title,
      description,
      year,
      img_logo,
      short_title,
    };

    const updatedGame = await Games.updateGame(id, newGame);

    let jsonResponse = updatedGame.toJSON();
    jsonResponse.urlImgLogo = buildURL(req, img_logo);

    return OkResponse(
      res,
      "Juego actualizado con éxito",
      `El juego ${jsonResponse.title} fue actualizado con éxito`,
      200,
      jsonResponse
    );
  } catch (error) {
    console.error(`Error en updateGame (controlador): ${error.message}`);
    return exceptionResponseControl(res, "updateGame", error.message);
  }
};

export const deleteGame = async (req, res) => {
  try {
    const { id } = req.params;
    const oldGame = await Games.getGameById(id);

    if (!oldGame) return notFoundByIdResponse(res, "deleteGame", id);

    const oldGameName = oldGame.title;
    const deletedGame = await Games.deleteGame(id);

    const resDeleteImg = await deleteImgPath(oldGame.img_logo);

    if (resDeleteImg?.value === false)
      return deleteOldImageErrorResponse(
        res,
        "deleteGame",
        resDeleteImg.message
      );

    return OkResponse(
      res,
      `Juego borrado con exito`,
      `El juego ${oldGameName} con la id: ${id} fue eliminado con exito`,
      200,
      id
    );
  } catch (error) {
    console.error(`Error en deleteGame (controlador): ${error.message}`);
    return exceptionResponseControl(res, "deleteGame", error.message);
  }
};

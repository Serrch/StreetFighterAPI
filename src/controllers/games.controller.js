import Games from "../models/games.model.js";
import path from "path";
import { OkResponse, badResponse } from "../utils/responses.js";
import { deleteImgPath } from "../utils/delete_img_path.js";
import { buildURL } from "../utils/buildURL.js";

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
    return badResponse(
      res,
      "Error al obtener los juegos",
      "Ocurrio una excepcion al obtener los juegos",
      500,
      error.message
    );
  }
};

export const getGameById = async (req, res) => {
  try {
    const { id } = req.params;
    const game = await Games.getGameById(id);

    if (!game) {
      return badResponse(
        res,
        "Error al obtener el juego",
        `No se encontro el juego con la id: ${id}`,
        404,
        id
      );
    }

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
    return badResponse(
      res,
      "Error al obtener el juego",
      "Ocurrio una excepcion al obtener el juego",
      500,
      error.message
    );
  }
};

export const insertGame = async (req, res) => {
  try {
    const { title, description, year, short_title } = req.body;
    const fileImgLogo = req.files?.img_logo?.[0];

    if (!fileImgLogo) {
      return badResponse(
        res,
        "Error al guardar imagen",
        "No se guardó la imagen en uploads",
        500,
        null
      );
    }

    const relativePath = path.posix.join(
      "uploads",
      "img_game_logos",
      fileImgLogo.filename
    );

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

    const fileImgLogo = req.files?.img_logo?.[0];

    if (fileImgLogo) {
      const resDeleteImg = await deleteImgPath(fileImgLogo);
      if (resDeleteImg.value === false) {
        console.log(
          "No se pudo borrar la imagen tras la excepción en insertGame"
        );
      } else {
        console.log("Imagen borrada exitosamente");
      }
    }

    return badResponse(
      res,
      "Error al insertar el juego",
      "Ocurrió una excepción en el controlador (insertGame)",
      500,
      error.message
    );
  }
};

export const updateGame = async (req, res) => {
  let oldGame = null;

  try {
    const { id } = req.params;
    oldGame = await Games.getGameById(id);

    if (!oldGame) {
      return badResponse(
        res,
        "No se encontró el juego",
        `No se encontró el juego con la ID: ${id}`,
        404,
        null
      );
    }

    const { title, description, year, short_title } = req.body;
    const fileImgLogo = req.files?.img_logo?.[0];

    if (!fileImgLogo) {
      return badResponse(
        res,
        "Error al guardar imagen",
        "No se guardó la imagen en uploads",
        500,
        null
      );
    }

    const resDeleteImg = await deleteImgPath(oldGame.img_logo);

    if (resDeleteImg?.value === false) {
      return badResponse(
        res,
        "Error al borrar imagen",
        "Ocurrió un error al borrar la imagen anterior",
        500,
        resDeleteImg.message
      );
    }

    const relativePath = path.posix.join(
      "uploads",
      "img_game_logos",
      fileImgLogo.filename
    );

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

    if (oldGame?.img_logo) {
      const resDeleteImg = await deleteImgPath(oldGame.img_logo);

      if (resDeleteImg?.value === false) {
        return badResponse(
          res,
          "Error al borrar imagen",
          "Ocurrió un error al borrar la imagen",
          500,
          resDeleteImg.message
        );
      }
    }

    return badResponse(
      res,
      "Error al actualizar el juego",
      "Ocurrió una excepción al actualizar",
      500,
      error.message
    );
  }
};

export const deleteGame = async (req, res) => {
  try {
    const { id } = req.params;
    const oldGame = await Games.getGameById(id);

    if (!oldGame) {
      return badResponse(
        res,
        "Juego no encontrado",
        `No se encontró el juego con la ID: ${id}`,
        404,
        id
      );
    }

    const oldGameName = oldGame.title;
    const deletedGame = await Games.deleteGame(id);

    const resDeleteImg = await deleteImgPath(oldGame.img_logo);

    if (resDeleteImg?.value === false) {
      return badResponse(
        res,
        "Error al borrar imagen",
        "Ocurrio un error al borrar la imagen",
        500,
        resDeleteImg.message
      );
    }

    return OkResponse(
      res,
      `Juego borrado con exito`,
      `El juego ${oldGameName} con la id: ${id} fue eliminado con exito`,
      200,
      id
    );
  } catch (error) {
    return badResponse(
      res,
      "Error al borrar el juego",
      "Ocurrio un error al eliminar el juego",
      500,
      error.message
    );
  }
};

import Games from "../models/games.model.js";
import path from "path";
import fs from "fs/promises";
import { OkResponse, badResponse } from "../utils/responses.js";

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

    const newImgLogo = buildURL(req, game.img_logo);
    game.img_logo = newImgLogo;

    res.json({ message: "Datos obtenidos con exito", game });
  } catch (error) {
    console.error("Error en getGameById", error);
    res.status(500).json({
      message: `Error al obtener el juego`,
      error: error.message,
    });
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
        "No se guardo la imagen en uploads",
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
      "Juego creado con exito",
      `El juego ${newGame.title} fue ingresado con exito`,
      201,
      jsonResponse
    );
  } catch (error) {
    console.log(`Error en insertGame (controlador): ${error}`);
    await deleteImg(req);
    return badResponse(
      res,
      "Error al insertar el juego",
      "Ocurrio una excepcion en el controlador (insertGame)",
      500,
      error.message
    );
  }
};

export const updateGame = async (req, res) => {
  try {
    const { id } = req.params;
    const oldGame = await Games.getGameById(id);

    if (!oldGame) {
      return badResponse(
        res,
        "No se encontro el juego",
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
        "No se guardo la imagen en uploads",
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

    const newGame = {
      title,
      description,
      year,
      img_logo,
      short_title,
    };

    await deleteImgPath(oldGame.img_logo);

    const updatedGame = await Games.updateGame(id, newGame);

    return res.status(201).json({
      message: `El juego ${updatedGame.title} fue actualizado con éxito`,
      data: {
        ...newGame,
        img_logo: buildURL(req, img_logo),
      },
    });
  } catch (error) {
    console.error(`Error en updateGame (controlador): ${error.message}`);
    await deleteImg(req);
    res.status(500).json({
      message: `Error al actualizar el juego`,
      error: error.message,
    });
  }
};

export const deleteGame = async (req, res) => {
  try {
    const { id } = req.params;
    const oldGame = await Games.getGameById(id);

    if (!oldGame) {
      return res
        .status(404)
        .json({ message: `No se encontro el juego con la ID: ${id}` });
    }

    const oldGameName = oldGame.title;
    const deletedGame = await Games.deleteGame(id);

    await deleteImgPath(oldGame.img_logo);

    return res.status(201).json({
      message: `El juego ${oldGameName} con la id: ${id} fue eliminado con exito`,
      data: deletedGame,
    });
  } catch (error) {
    res.status(500).json({
      message: `No pudo eliminarse el juego`,
      error: error.message,
    });
  }
};

function buildURL(req, filePath) {
  const baseUrl = `${req.protocol}://${req.get("host")}`;
  const webPath = filePath.replace(/\\/g, "/");
  return `${baseUrl}/${webPath}`;
}

async function deleteImg(req) {
  try {
    if (req.file) {
      const fullPath = path.join(process.cwd(), req.file.path);
      await fs.unlink(fullPath);
    }
  } catch (error) {
    console.log(`No se pudo borrar la imagen: ${error.message}`);
  }
}

async function deleteImgPath(imgPath) {
  try {
    if (!imgPath) return;

    const fullPath = path.join(process.cwd(), imgPath);
    await fs.access(fullPath);
    await fs.unlink(fullPath);

    console.log("Imagen eliminada correctamente");
  } catch (err) {
    console.log(`No se pudo borrar la imagen anterior: ${err.message}`);
  }
}

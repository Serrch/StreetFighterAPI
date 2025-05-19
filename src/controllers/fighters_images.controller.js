import FighterImage from "../models/fighter_images.model.js";
import path from "path";
import { OkResponse, badResponse } from "../utils/responses.js";
import { deleteImgPath } from "../utils/delete_img_path.js";
import { existId } from "../utils/exists_ids.js";
import { buildURL } from "../utils/buildURL.js";

export const getFighterImages = async (req, res) => {
  try {
    const fighterImages = await FighterImage.getFighterImages();

    const imagesWithPublicUrl = fighterImages.map((img) => {
      return {
        id_image: img.id_image,
        id_fighter_version: img.id_fighter_version,
        image_type: img.image_type,
        image: img.image,
        imageUrl: buildURL(req, img.image),
      };
    });

    return OkResponse(
      res,
      "Imagenes obtenidas con exito",
      "Todos las imagenes obtenidas con exito",
      200,
      imagesWithPublicUrl
    );
  } catch (error) {
    return badResponse(
      res,
      "Error al obtener las imagenes",
      "Ocurrio una excepcion al obtener las imagenes",
      500,
      error.message
    );
  }
};

export const getFighterImageById = async (req, res) => {
  try {
    const { id } = req.params;
    const fighterImage = await FighterImage.getFighterImageById(id);

    if (!fighterImage) {
      return badResponse(
        res,
        "Error al obtener la imagen",
        `No se encontro la imagen con la id: ${id}`,
        404,
        id
      );
    }

    let jsonResponse = fighterImage.toJSON();
    jsonResponse.imageUrl = buildURL(req, jsonResponse.image);

    return OkResponse(
      res,
      "Datos obtenidos con exito",
      `La imagen se obtuvo con exito `,
      200,
      jsonResponse
    );
  } catch (error) {
    console.error("Error en getFighterImageById", error);
    return badResponse(
      res,
      "Error al obtener la imagen",
      "Ocurrio una excepcion al obtener la imagen",
      500,
      error.message
    );
  }
};

export const insertFighterImage = async (req, res) => {
  try {
    const { id_fighter_version, image_type } = req.body;
    const fileImage = req.files?.image?.[0];
    const existIdFighterVersion = await existId(
      "fightersVersion",
      id_fighter_version
    );
    if (!existIdFighterVersion)
      return badResponse(
        res,
        "No se encontro la id_fighter_version",
        `La id ${id_fighter_version} no corresponde a alguna version`,
        404,
        null
      );

    if (!fileImage) {
      return badResponse(
        res,
        "Error al guardar imagen",
        "No se guardó la imagen en uploads",
        500,
        null
      );
    }

    const relativePath = buildRelativePath(
      id_fighter_version,
      image_type,
      fileImage.filename
    );

    const image = relativePath;

    const newFighterImage = await FighterImage.insertFighterImage({
      id_fighter_version,
      image_type,
      image,
    });

    let jsonResponse = newFighterImage.toJSON();
    jsonResponse.imageUrl = buildURL(req, image);

    return OkResponse(
      res,
      "Imagen creada con éxito",
      `La imagen fue ingresada con éxito`,
      201,
      jsonResponse
    );
  } catch (error) {
    console.log(`Error en insertFighterImage (controlador): ${error}`);

    const fileImage = req.files?.image?.[0];

    if (fileImage) {
      const resDeleteImg = await deleteImgPath(fileImage);
      if (resDeleteImg.value === false) {
        console.log(
          "No se pudo borrar la imagen tras la excepción en insertFighterImage"
        );
      } else {
        console.log("Imagen borrada exitosamente");
      }
    }

    return badResponse(
      res,
      "Error al insertar la imagen",
      "Ocurrió una excepción en el controlador (insertFighterImage)",
      500,
      error.message
    );
  }
};

export const updateFighterImage = async (req, res) => {
  let oldFighterImage = null;

  try {
    const { id } = req.params;
    oldFighterImage = await FighterImage.getFighterImageById(id);

    if (!oldFighterImage) {
      return badResponse(
        res,
        "No se encontró la imagen",
        `No se encontró la imagen con la ID: ${id}`,
        404,
        null
      );
    }

    const { id_fighter_version, image_type } = req.body;
    const fileImage = req.files?.image?.[0];

    const existIdFighterVersion = await existId(
      "fightersVersion",
      id_fighter_version
    );
    if (!existIdFighterVersion)
      return badResponse(
        res,
        "No se encontro la id_fighter_version",
        `La id ${id_fighter_version} no corresponde a alguna version`,
        404,
        null
      );

    if (!fileImage) {
      return badResponse(
        res,
        "Error al guardar imagen",
        "No se guardó la imagen en uploads",
        500,
        null
      );
    }

    const resDeleteImg = await deleteImgPath(oldFighterImage.image);

    if (resDeleteImg?.value === false) {
      return badResponse(
        res,
        "Error al borrar imagen",
        "Ocurrió un error al borrar la imagen anterior en updateFighterImage",
        500,
        resDeleteImg.message
      );
    }

    const relativePath = buildRelativePath(
      id_fighter_version,
      image_type,
      fileImage.filename
    );

    const image = relativePath;

    const newFighterImage = {
      id_fighter_version,
      image_type,
      image,
    };

    const updatedFighterImage = await FighterImage.updateFighterImage(
      id,
      newFighterImage
    );

    let jsonResponse = updatedFighterImage.toJSON();
    jsonResponse.imageUrl = buildURL(req, image);

    return OkResponse(
      res,
      "FighterImage actualizada con éxito",
      `La imagen con id_fighter_version: ${jsonResponse.id_fighter_version} fue actualizada con éxito`,
      200,
      jsonResponse
    );
  } catch (error) {
    console.error(
      `Error en updateFighterImage (controlador): ${error.message}`
    );

    if (oldFighterImage?.image) {
      const resDeleteImg = await deleteImgPath(oldFighterImage.image);

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
      "Error al actualizar la imagen",
      "Ocurrió una excepción al actualizar la imagen",
      500,
      error.message
    );
  }
};

export const deleteFighterImage = async (req, res) => {
  try {
    const { id } = req.params;
    const oldFighterImage = await FighterImage.getFighterImageById(id);

    if (!oldFighterImage) {
      return badResponse(
        res,
        "Imagen no encontrada",
        `No se encontró la imagen con la ID: ${id}`,
        404,
        id
      );
    }

    const oldFighterImageId = oldFighterImage.id_image;
    const deletedFighterImage = await FighterImage.deleteFighterImage(id);

    const resDeleteImg = await deleteImgPath(oldFighterImage.image);

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
      `FighterImage borrada con exito`,
      `La imagen con la id: ${oldFighterImageId} fue eliminada con exito`,
      200,
      id
    );
  } catch (error) {
    return badResponse(
      res,
      "Error al borrar la imagen",
      "Ocurrio un error al eliminar la imagen",
      500,
      error.message
    );
  }
};

function buildRelativePath(id_fighter_version, image_type, filename) {
  return path.posix.join(
    "uploads",
    "img_fighters",
    `${id_fighter_version}`,
    `${image_type}`,
    filename
  );
}

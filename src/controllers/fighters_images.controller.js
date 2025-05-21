import FighterImage from "../models/fighter_images.model.js";
import {
  OkResponse,
  badResponse,
  deleteOldImageErrorResponse,
  emptyImages,
  exceptionResponseControl,
  notFoundByIdResponse,
} from "../utils/responses.js";
import { deleteImgPath } from "../utils/delete_img_path.js";
import { existId } from "../utils/exists_ids.js";
import { buildURL } from "../utils/buildURL.js";
import { saveImgBuffer } from "../utils/save_img_buffer.js";

export const getFighterImages = async (req, res) => {
  try {
    const fighterImages = await FighterImage.getFighterImages();

    const imagesWithPublicUrl = fighterImages.map((img) => ({
      id_image: img.id_image,
      id_fighter_version: img.id_fighter_version,
      image_type: img.image_type,
      image: img.image,
      imageUrl: buildURL(req, img.image),
    }));

    return OkResponse(
      res,
      "Imágenes obtenidas con éxito",
      "Todas las imágenes fueron obtenidas correctamente",
      200,
      imagesWithPublicUrl
    );
  } catch (error) {
    return exceptionResponseControl(res, "getFighterImages", error.message);
  }
};

export const getFighterImageById = async (req, res) => {
  try {
    const { id } = req.params;
    const fighterImage = await FighterImage.getFighterImageById(id);

    if (!fighterImage)
      return notFoundByIdResponse(res, "getFighterImageById", id);

    const jsonResponse = fighterImage.toJSON();
    jsonResponse.imageUrl = buildURL(req, jsonResponse.image);

    return OkResponse(
      res,
      "Imagen obtenida con éxito",
      "La imagen fue obtenida correctamente",
      200,
      jsonResponse
    );
  } catch (error) {
    return exceptionResponseControl(res, "getFighterImageById", error.message);
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
      return notFoundByIdResponse(
        res,
        "insertFighterImage",
        id_fighter_version
      );

    if (!fileImage) return emptyImages(res, ["image"], "insertFighterImage");

    const image = await saveImgBuffer(req, fileImage, false);

    const newFighterImage = await FighterImage.insertFighterImage({
      id_fighter_version,
      image_type,
      image,
    });

    const jsonResponse = newFighterImage.toJSON();
    jsonResponse.imageUrl = buildURL(req, image);

    return OkResponse(
      res,
      "Imagen creada con éxito",
      "La imagen fue creada correctamente",
      201,
      jsonResponse
    );
  } catch (error) {
    const fileImage = req.files?.image?.[0];
    if (fileImage) await deleteImgPath(fileImage);

    return exceptionResponseControl(res, "insertFighterImage", error.message);
  }
};

export const updateFighterImage = async (req, res) => {
  let oldFighterImage = null;

  try {
    const { id } = req.params;
    oldFighterImage = await FighterImage.getFighterImageById(id);

    if (!oldFighterImage)
      return notFoundByIdResponse(res, "updateFighterImage", id);

    const { id_fighter_version, image_type } = req.body;
    const fileImage = req.files?.image?.[0];

    const existIdFighterVersion = await existId(
      "fightersVersion",
      id_fighter_version
    );
    if (!existIdFighterVersion)
      return notFoundByIdResponse(
        res,
        "updateFighterImage",
        id_fighter_version
      );

    if (!fileImage) return emptyImages(res, ["image"], "updateFighterImage");

    const resDeleteImg = await deleteImgPath(oldFighterImage.image);
    if (resDeleteImg?.value === false)
      return deleteOldImageErrorResponse(
        res,
        "updateFighterImage",
        resDeleteImg.message
      );

    const newImagePath = await saveImgBuffer(req, fileImage, false);

    const newData = {
      id_fighter_version,
      image_type,
      image: newImagePath,
    };

    const updatedFighterImage = await FighterImage.updateFighterImage(
      id,
      newData
    );

    const jsonResponse = updatedFighterImage.toJSON();
    jsonResponse.imageUrl = buildURL(req, newImagePath);

    return OkResponse(
      res,
      "Imagen actualizada con éxito",
      "La imagen fue actualizada correctamente",
      200,
      jsonResponse
    );
  } catch (error) {
    if (oldFighterImage?.image) await deleteImgPath(oldFighterImage.image);
    return exceptionResponseControl(res, "updateFighterImage", error.message);
  }
};

export const deleteFighterImage = async (req, res) => {
  try {
    const { id } = req.params;
    const oldFighterImage = await FighterImage.getFighterImageById(id);

    if (!oldFighterImage)
      return notFoundByIdResponse(res, "deleteFighterImage", id);

    await FighterImage.deleteFighterImage(id);

    const resDeleteImg = await deleteImgPath(oldFighterImage.image);
    if (resDeleteImg?.value === false)
      return deleteOldImageErrorResponse(
        res,
        "deleteFighterImage",
        resDeleteImg.message
      );

    return OkResponse(
      res,
      "Imagen eliminada con éxito",
      `La imagen con ID: ${id} fue eliminada correctamente`,
      200,
      id
    );
  } catch (error) {
    return exceptionResponseControl(res, "deleteFighterImage", error.message);
  }
};

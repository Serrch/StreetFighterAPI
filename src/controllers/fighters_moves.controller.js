import FighterMove from "../models/fighter_moves.model.js";
import {
  OkResponse,
  badResponse,
  emptyImages,
  exceptionResponseControl,
  notFoundByIdResponse,
  deleteOldImageErrorResponse,
} from "../utils/responses.js";
import { existId } from "../utils/exists_ids.js";
import { saveImgBuffer } from "../utils/save_img_buffer.js";
import { buildURL } from "../utils/buildURL.js";
import { deleteImgPath } from "../utils/delete_img_path.js";

export const getFighterMoves = async function (req, res) {
  try {
    const fighterMoves = await FighterMove.getFighterMoves();

    const movesWithUrl = fighterMoves.map((move) => {
      return {
        id_fighter_version: move.id_fighter_version,
        name: move.name,
        description: move.description,
        img_command: move.img_command,
        img_execution: move.img_execution,
        is_super_move: move.is_super_move,
        img_comand_url: buildURL(req, move.img_command),
        img_execution_url: buildURL(req, move.img_execution),
      };
    });

    return OkResponse(
      res,
      "Movimientos obtenidos con exito",
      `Los movimientos fueron obtenidos con exito`,
      200,
      movesWithUrl
    );
  } catch (error) {
    return exceptionResponseControl(res, "getFighterMoves", error.message);
  }
};

export const getFighterMoveById = async (req, res) => {
  try {
    const { id } = req.params;
    const fighterMove = await FighterMove.getFighterMoveById(id);

    if (!fighterMove)
      return notFoundByIdResponse(res, "getFighterMoveById", id);

    return OkResponse(
      res,
      "Movimiento obtenido con exito",
      "Se obtuvo el movimiento con exito",
      200,
      fighterMove
    );
  } catch (error) {
    return exceptionResponseControl(res, "getFighterMoveById", error.message);
  }
};

export const insertFighterMove = async (req, res) => {
  try {
    const { id_fighter_version, name, description, is_super_move } = req.body;
    const img_command = req.files.img_command?.[0];
    const img_execution = req.files.img_execution?.[0];

    const existIdFighterVersion = await existId(
      "fightersVersion",
      id_fighter_version
    );

    if (!existIdFighterVersion)
      return notFoundByIdResponse(res, "insertFighterMove", id_fighter_version);

    if (!img_command || !img_execution)
      return emptyImages(
        res,
        ["img_command", "img_execution"],
        "insertFighterMove"
      );

    const imgExecutionRelativePath = await saveImgBuffer(
      req,
      img_execution,
      false
    );
    const imgCommandRelativePath = await saveImgBuffer(req, img_command, true);

    const newFighterMove = await FighterMove.insertFighterMove({
      id_fighter_version,
      name,
      description,
      img_command: imgCommandRelativePath,
      img_execution: imgExecutionRelativePath,
      is_super_move,
    });

    let jsonResponse = newFighterMove.toJSON();
    jsonResponse.imgCommandUrl = buildURL(req, imgCommandRelativePath);
    jsonResponse.imgExecutionUrl = buildURL(req, imgExecutionRelativePath);

    return OkResponse(
      res,
      "Movimiento creado con exito",
      `El movimiento ${name} fue creado con exito`,
      201,
      jsonResponse
    );
  } catch (error) {
    console.log(`Error en insertFighterMove (controlador): ${error}`);
    return exceptionResponseControl(res, "insertFighterMove", error.message);
  }
};

export const updateFighterMove = async (req, res) => {
  try {
    const { id } = req.params;
    const oldFighterMove = await FighterMove.getFighterMoveById(id);

    if (!oldFighterMove)
      return notFoundByIdResponse(res, "updateFighterMove", id);

    const { id_fighter_version, name, description, is_super_move } = req.body;
    const img_command = req.files.img_command?.[0];
    const img_execution = req.files.img_execution?.[0];

    if (!img_command || !img_execution)
      return emptyImages(
        res,
        ["img_command", "img_execution"],
        "updateFighterMove"
      );

    const resDeleteOldImgCommand = await deleteImgPath(
      oldFighterMove.img_command
    );
    const resDeleteOldImgExecution = await deleteImgPath(
      oldFighterMove.img_execution
    );

    if (resDeleteOldImgCommand?.value === false)
      return deleteOldImageErrorResponse(
        res,
        "updateFighterMove",
        resDeleteOldImgCommand.message
      );

    if (resDeleteOldImgExecution?.value === false)
      return deleteOldImageErrorResponse(
        res,
        "updateFighterMove",
        resDeleteOldImgExecution.message
      );

    const imgExecutionRelativePath = await saveImgBuffer(
      req,
      img_execution,
      false
    );
    const imgCommandRelativePath = await saveImgBuffer(req, img_command, true);

    const newFighterMove = {
      id_fighter_version,
      name,
      description,
      img_command: imgCommandRelativePath,
      img_execution: imgExecutionRelativePath,
      is_super_move,
    };

    const updatedFighterMove = await FighterMove.updateFighterMove(
      id,
      newFighterMove
    );

    let jsonResponse = updatedFighterMove.toJSON();
    jsonResponse.imgCommandUrl = buildURL(req, imgCommandRelativePath);
    jsonResponse.imgExecutionUrl = buildURL(req, imgExecutionRelativePath);

    return OkResponse(
      res,
      "Movimiento actualizado con éxito",
      `El movimiento con id ${id} fue actualizado con éxito`,
      200,
      jsonResponse
    );
  } catch (error) {
    console.log(`Error en updateFighterMove (controlador): ${error.message}`);
    return exceptionResponseControl(res, "updateFighterMove", error.message);
  }
};

export const deleteFighterMove = async (req, res) => {
  try {
    const { id } = req.params;
    const oldFighterMove = await FighterMove.getFighterMoveById(id);

    if (!oldFighterMove)
      return notFoundByIdResponse(res, "deleteFighterMove", id);

    const resDeleteOldImgCommand = await deleteImgPath(
      oldFighterMove.img_command
    );
    const resDeleteOldImgExecution = await deleteImgPath(
      oldFighterMove.img_execution
    );

    if (resDeleteOldImgCommand?.value === false)
      return deleteOldImageErrorResponse(
        res,
        "deleteFighterMove",
        resDeleteOldImgCommand.message
      );

    if (resDeleteOldImgExecution?.value === false)
      return deleteOldImageErrorResponse(
        res,
        "deleteFighterMove",
        resDeleteOldImgExecution.message
      );

    const deletedFighterMove = await FighterMove.deleteFighterMove(id);

    return OkResponse(
      res,
      "Movimiento borrado con exito",
      `El movimiento con la id ${id} fue borrado con exito`,
      200,
      deletedFighterMove
    );
  } catch (error) {
    console.log(`Error en deleteFighterMove (controlador): ${error.message}`);
    return exceptionResponseControl(res, "deleteFighterMove", error.message);
  }
};

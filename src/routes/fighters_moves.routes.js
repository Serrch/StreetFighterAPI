import { Router } from "express";
import multer from "multer";
import { validateFighterMoves } from "../validations/fighter_moves_validations/fighter_move_validations.js";
import { validateFields } from "../validations/validate-fields.js";
import {
  getFighterMoves,
  getFighterMoveById,
  insertFighterMove,
  updateFighterMove,
  deleteFighterMove,
} from "../controllers/fighters_moves.controller.js";
import { validateImages } from "../validations/validate-image.js";

const upload = multer({ storage: multer.memoryStorage() });
const router = Router();

router.get("/fighter_moves", getFighterMoves);
router.get("/fighter_moves/:id", getFighterMoveById);
router.post(
  "/fighter_moves",
  upload.fields([
    { name: "img_command", maxCount: 1 },
    { name: "img_execution", maxCount: 1 },
  ]),
  validateImages(["img_command", "img_execution"]),
  validateFighterMoves,
  validateFields,
  insertFighterMove
);

router.put(
  "/fighter_moves/:id",
  upload.fields([
    { name: "img_command", maxCount: 1 },
    { name: "img_execution", maxCount: 1 },
  ]),
  validateImages(["img_command", "img_execution"]),
  validateFighterMoves,
  validateFields,
  updateFighterMove
);

router.delete("/fighter_moves/:id", deleteFighterMove);

export default router;

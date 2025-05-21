import { Router } from "express";
import multer from "multer";
import {
  getGames,
  getGameById,
  insertGame,
  updateGame,
  deleteGame,
} from "../controllers/games.controller.js";
import { validateGame } from "../validations/games_validations/game_validations.js";
import { validateFields } from "../validations/validate-fields.js";
import { validateImages } from "../validations/validate-image.js";

const upload = multer({ storage: multer.memoryStorage() });
const router = Router();

router.get("/games", getGames);
router.get("/games/:id", getGameById);
router.post(
  "/games",
  upload.fields([{ name: "img_logo", maxCount: 1 }]),
  validateImages(["img_logo"]),
  validateGame,
  validateFields,
  insertGame
);
router.put(
  "/games/:id",
  upload.fields([{ name: "img_logo", maxCount: 1 }]),
  validateImages(["img_logo"]),
  validateGame,
  validateFields,
  updateGame
);
router.delete("/games/:id", deleteGame);

export default router;

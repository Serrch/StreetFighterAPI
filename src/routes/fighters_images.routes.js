import { Router } from "express";
import multer from "multer";
import storage from "../utils/img_functions.js";
import { validateFighterImage } from "../validations/fighter_image_validations/fighter_image_validations.js";
import { validateFields } from "../validations/validate-fields.js";
import { validateImages } from "../validations/validate-image.js";
import {
  getFighterImages,
  getFighterImageById,
  insertFighterImage,
  updateFighterImage,
  deleteFighterImage,
} from "../controllers/fighters_images.controller.js";

const upload = multer({ storage });
const router = Router();

router.get("/fighter_image", getFighterImages);
router.get("/fighter_image/:id", getFighterImageById);
router.post(
  "/fighter_image",
  upload.fields([{ name: "image", maxCount: 1 }]),
  validateImages(["image"]),
  validateFighterImage,
  validateFields,
  insertFighterImage
);

router.put(
  "/fighter_image/:id",
  upload.fields([{ name: "image", maxCount: 1 }]),
  validateImages(["image"]),
  validateFighterImage,
  validateFields,
  updateFighterImage
);

router.delete("/fighter_image/:id", deleteFighterImage);

export default router;

import { Router } from "express";
import {
  getFighterVersion,
  getFighterVersionById,
  insertFighterVersion,
  updateFighterVersion,
  deleteFighterVersion,
} from "../controllers/fighters_versions.controller.js";
import { validateFighterVersion } from "../validations/fighter_version_validations/fighter_version_validations.js";
import { validateFields } from "../validations/validate-fields.js";

const router = Router();

router.get("/fighter_versions", getFighterVersion);
router.get("/fighter_versions/:id", getFighterVersionById);
router.post(
  "/fighter_versions",
  validateFighterVersion,
  validateFields,
  insertFighterVersion
);
router.put(
  "/fighter_versions/:id",
  validateFighterVersion,
  validateFields,
  updateFighterVersion
);
router.delete("/fighter_versions/:id", deleteFighterVersion);

export default router;

import { Router } from "express";
import {
  deleteFighter,
  getFighterById,
  getFighterDetails,
  getFighters,
  insertFighter,
  updateFighter,
} from "../controllers/fighters.controller.js";
import { validateFighter } from "../validations/fighter_validations/fighter_validations.js";
import { validateFields } from "../validations/validate-fields.js";

const router = Router();

router.get("/fighters", getFighters);
router.get("/fighters/:id", getFighterDetails);
router.post("/fighters", validateFighter, validateFields, insertFighter);
router.put("/fighters/:id", validateFighter, validateFields, updateFighter);
router.delete("/fighters/:id", deleteFighter);

export default router;

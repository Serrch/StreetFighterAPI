import { Router } from "express";
import {
  deleteFighter,
  getFighterById,
  getFighters,
  insertFighter,
  updateFighter,
} from "../controllers/fighters.controller.js";

const router = Router();

router.get("/fighters", getFighters);
router.get("/fighters/:id", getFighterById);
router.post("/fighters", insertFighter);
router.put("/fighters/:id", updateFighter);
router.delete("/fighters/:id", deleteFighter);

export default router;

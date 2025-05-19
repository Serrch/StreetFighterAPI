import { validationResult } from "express-validator";
import { badResponse } from "../utils/responses.js";
export const validateFields = (req, res, next) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({
      status: "error",
      title: "Error de validación",
      message: "Campos inválidos en la petición",
      errors: errores.array(),
    });
  }
  next();
};

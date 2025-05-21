import { check, validationResult } from "express-validator";

export const validateGame = [
  check("title")
    .notEmpty()
    .withMessage("El campo title es obligatorio")
    .isString()
    .withMessage("El campo title debe ser un string")
    .isLength({ min: 1, max: 100 })
    .withMessage("El campo title debe tener entre 1 y 100 caracteres"),
  check("description")
    .notEmpty()
    .withMessage("El campo description es obligatorio")
    .isString()
    .withMessage("El campo description debe ser un string")
    .isLength({ min: 1, max: 255 })
    .withMessage("El campo description debe tener entre 1 y 255 caracteres"),
  check("year")
    .notEmpty()
    .withMessage("El campo year es obligatorio")
    .isInt({ min: 1000, max: 9999 })
    .withMessage("El campo year debe tener 4 digitos"),
  check("short_title")
    .notEmpty()
    .withMessage("El campo short_title es obligatorio")
    .isString()
    .withMessage("El campo short_title debe ser un string")
    .isLength({ min: 1, max: 20 })
    .withMessage("El campo short_title debe tener entre 1 y 20 caracteres"),
  ,
];

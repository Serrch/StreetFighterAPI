import { check, validationResult } from "express-validator";

export const validateFighterVersion = [
  check("id_fighter")
    .notEmpty()
    .withMessage("El campo id_fighter es obligatorio")
    .isInt()
    .withMessage("El campo id_fighter debe ser un int"),
  check("id_game")
    .notEmpty()
    .withMessage("El campo id_game es obligatorio")
    .isInt()
    .withMessage("El campo id_game debe ser un int"),
  check("version_name")
    .notEmpty()
    .withMessage("El campo version_name es obligatorio")
    .isString()
    .withMessage("El campo version_name debe ser un string")
    .isLength({ min: 1, max: 50 })
    .withMessage("El campo version_name debe tener entre 1 y 50 caracteres"),
  check("description")
    .notEmpty()
    .withMessage("El campo description es obligatorio")
    .isString()
    .withMessage("El campo description debe ser un string")
    .isLength({ min: 1, max: 255 })
    .withMessage("El campo description debe tener entre 1 y 255 caracteres"),
];

import { check } from "express-validator";

export const validateFighterMoves = [
  check("id_fighter_version")
    .notEmpty()
    .withMessage("El campo id_fighter_version es obligatorio")
    .isInt()
    .withMessage("El campo id_fighter debe ser un int"),
  check("name")
    .notEmpty()
    .withMessage("El campo name es obligatorio")
    .isString()
    .withMessage("El campo name debe ser un string")
    .isLength({ min: 1, max: 255 })
    .withMessage("El campo name debe tener entre 1 y 255 caracteres"),
  check("description")
    .notEmpty()
    .withMessage("El campo description es obligatorio")
    .isString()
    .withMessage("El campo description debe ser un string")
    .isLength({ min: 1 })
    .withMessage("El campo description debe tener al menos 1 caracter"),
  check("is_super_move")
    .notEmpty()
    .withMessage("El campo is_super_move es obligatorio")
    .isBoolean()
    .withMessage("El campo is_super_move debe ser True o False"),
];

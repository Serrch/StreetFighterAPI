import { check } from "express-validator";

export const validateFighter = [
  check("name")
    .notEmpty()
    .withMessage("El campo name es obligatorio")
    .isString()
    .withMessage("El campo name debe ser un string")
    .isLength({ min: 1, max: 100 })
    .withMessage("El campo name debe tener entre 1 y 100 caracteres"),
  check("history")
    .notEmpty()
    .withMessage("El history name es obligatorio")
    .isString()
    .withMessage("El campo history no es un string")
    .isLength({ min: 1 })
    .withMessage("El campo history debe contener al menos un caracter"),
  check("description")
    .notEmpty()
    .withMessage("El description name es obligatorio")
    .isString()
    .withMessage("El campo description no es un string")
    .isLength({ min: 1 })
    .withMessage("El campo description debe contener al menos un caracter"),
  check("fighting_style")
    .notEmpty()
    .withMessage("El fighting_style es obligatorio")
    .isString()
    .withMessage("El campo fighting_style debe ser un string")
    .isLength({ min: 1, max: 100 })
    .withMessage("El campo fighting_style debe tener entre 1 y 100 caracteres"),
  check("nationality")
    .notEmpty()
    .withMessage("El nationality es obligatorio")
    .isString()
    .withMessage("El campo nationality debe ser un string")
    .isLength({ min: 1, max: 50 })
    .withMessage("El campo nationality debe tener entre 1 y 50 caracteres"),
];

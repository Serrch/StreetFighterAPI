import { check, validationResult } from "express-validator";

const allowedImageTypes = [
  "portrait",
  "full",
  "full-alt",
  "full-sprite",
  "full-model",
  "icon",
];

export const validateFighterImage = [
  check("id_fighter_version")
    .notEmpty()
    .withMessage("El campo id_fighter_version es obligatorio")
    .isInt()
    .withMessage("El campo id_fighter_version debe ser un Int"),
  check("image_type")
    .notEmpty()
    .withMessage("El campo image_type es obligatorio")
    .isString("El campo image_type debe ser un string")
    .isLength({ min: 1, max: 50 })
    .withMessage("El campo image_type debe tener entre 1 y 50 caracteres")
    .custom((value) => {
      if (!allowedImageTypes.includes(value)) {
        throw new Error(
          `El tipo de imagen ${value} no pertenece a los tipos permitidos ${allowedImageTypes.join(
            ", "
          )} `
        );
      }
      return true;
    }),
];

export const validateImages = (fieldNames = [], options = {}) => {
  const {
    allowedTypes = ["image/jpeg", "image/png", "image/webp"],
    maxFileSizeMB = 5,
  } = options;

  return (req, res, next) => {
    const errors = [];

    for (const name of fieldNames) {
      const files = req.files?.[name];

      if (!files || files.length === 0) {
        errors.push({
          msg: `La imagen '${name}' es obligatoria`,
          param: name,
        });
        continue;
      }

      for (const file of files) {
        if (!allowedTypes.includes(file.mimetype)) {
          errors.push({
            msg: `El campo '${name}' tiene un formato no válido (solo JPG, PNG, WEBP)`,
            param: name,
          });
        }

        const maxBytes = maxFileSizeMB * 1024 * 1024;
        if (file.size > maxBytes) {
          errors.push({
            msg: `El archivo '${file.originalname}' excede el tamaño máximo de ${maxFileSizeMB}MB`,
            param: name,
          });
        }
      }
    }

    if (errors.length > 0) {
      return res.status(400).json({
        status: "error",
        title: "Error de validación de imagen",
        errores: errors,
      });
    }

    next();
  };
};

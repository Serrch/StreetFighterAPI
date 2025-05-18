export const validateImages = (options = {}) => {
  const {
    fields = [],
    allowedTypes = ["image/jpeg", "image/png", "image/webp"],
    requiredFields = [],
    maxFileSizeMB = 5,
  } = options;

  return (req, res, next) => {
    const errors = [];

    for (const field of fields) {
      const files = req.files?.[field.name];

      if (
        requiredFields.includes(field.name) &&
        (!files || files.length === 0)
      ) {
        errors.push({
          msg: `La imagen '${field.name}' es obligatoria`,
          param: field.name,
        });
        continue;
      }

      if (files) {
        for (const file of files) {
          if (!allowedTypes.includes(file.mimetype)) {
            errors.push({
              msg: `El campo '${field.name}' tiene un formato no válido (solo JPG, PNG, WEBP)`,
              param: field.name,
            });
          }

          const maxBytes = maxFileSizeMB * 1024 * 1024;
          if (file.size > maxBytes) {
            errors.push({
              msg: `El archivo '${file.originalname}' excede el tamaño máximo de ${maxFileSizeMB}MB`,
              param: field.name,
            });
          }
        }
      }
    }

    if (errors.length > 0) {
      return res.status(400).json({ errores: errors });
    }

    next();
  };
};

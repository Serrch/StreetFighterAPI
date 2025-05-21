export function OkResponse(res, title, message, status, content) {
  return res.status(status).json({
    title,
    message,
    status,
    content,
  });
}

export function badResponse(res, title, message, status, errorMessage) {
  return res.status(status).json({
    title,
    message,
    status,
    errorMessage,
  });
}

export function notFoundByIdResponse(res, controlName, id) {
  return res.status(404).json({
    title: "Data no obtenida",
    message: `No se obtuvieron datos para la id: ${id} en ${controlName}`,
    status: 404,
    content: null,
  });
}

export function exceptionResponseControl(res, controlName, errorMessage) {
  return res.status(500).json({
    title: "Ocurrio una excepcion",
    message: `Ocurrio una excepcion en el controlador (${controlName})`,
    status: 500,
    error: errorMessage,
  });
}

export function emptyImages(res, arrFields, controlName) {
  return res.status(400).json({
    title: `Faltan archivos de imagen en ${controlName}`,
    message: `Faltan los campos: ${arrFields.join(", ")}`,
    status: 400,
    error: null,
  });
}

export function deleteOldImageErrorResponse(res, controlName, errorMessage) {
  return res.status(400).json({
    title: "Ocurrio un error al borrar la imagen",
    message: `Ocurrio un error al borrar la imagen anterior en ${controlName}`,
    status: 400,
    error: errorMessage,
  });
}

import path from "path";
import fs from "fs/promises";
import { BASE_UPLOAD_PATH } from "./const-globales.js";

export async function deleteImgPath(imgPath) {
  try {
    if (!imgPath)
      return {
        message: "No se proporciono una direccion valida para borrar la imagen",
        value: false,
      };

    const fullPath = path.join(BASE_UPLOAD_PATH, imgPath);

    await fs.access(fullPath);
    await fs.unlink(fullPath);
    console.log(fullPath);
    console.log("Imagen eliminada correctamente");
    return null;
  } catch (err) {
    console.log(`No se pudo borrar la imagen anterior: ${err.message}`);
    return {
      message: `No se pudo borrar la imagen anterior ${err.message}`,
      value: false,
    };
  }
}

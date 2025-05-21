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
    return {
      message: "Imagen eliminada correctamente",
      value: true,
    };
  } catch (err) {
    if (err.code === "ENOENT") {
      console.warn(`Archivo ya estaba eliminado: ${imgPath}`);
      return {
        message: "Archivo ya estaba eliminado",
        value: true,
      };
    }

    console.log(`No se pudo borrar la imagen anterior: ${err.message}`);
    return {
      message: `No se pudo borrar la imagen anterior ${err.message}`,
      value: false,
    };
  }
}

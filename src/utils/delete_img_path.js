import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function deleteImgPath(imgPath) {
  try {
    if (!imgPath) return;

    const fullPath = path.join(__dirname, "..", imgPath);
    await fs.access(fullPath);
    await fs.unlink(fullPath);

    console.log("Imagen eliminada correctamente");
  } catch (err) {
    console.log(`No se pudo borrar la imagen anterior: ${err.message}`);
  }
}

import fs from "fs/promises";
import path from "path";
import { BASE_UPLOAD_PATH } from "./const-globales.js";

export async function saveImgBuffer(req, fileImage, command) {
  const rutaRelativa = obtenerRutaRelativa(req, command);
  const folder = path.join(BASE_UPLOAD_PATH, "uploads", rutaRelativa);
  const imgName = definirNombre(req, fileImage.originalname, command);
  const fullPath = path.join(folder, imgName);

  await fs.mkdir(folder, { recursive: true });
  await fs.writeFile(fullPath, fileImage.buffer);

  const relativePath = path.posix.join("uploads", rutaRelativa, imgName);
  return relativePath;
}

function definirNombre(req, originalname, command) {
  const extension = originalname.split(".").pop();
  const endpoint = req.originalUrl;
  const body = req.body;
  let imgDefName;

  if (endpoint.startsWith("/api/games")) {
    imgDefName = `${body.short_title}_logo`;
  }

  if (endpoint.startsWith("/api/fighter_image")) {
    imgDefName = `${body.id_fighter_version}_${body.image_type}`;
  }

  if (endpoint.startsWith("/api/fighter_moves")) {
    imgDefName = command
      ? `${body.id_fighter_version}_${body.name}_command`
      : `${body.id_fighter_version}_${body.name}_execution`;
  }

  if (!imgDefName) imgDefName = "default_image";

  return `${Date.now()}_${imgDefName}.${extension}`;
}

function obtenerRutaRelativa(req, command) {
  const endpoint = req.originalUrl;

  if (endpoint.startsWith("/api/games")) {
    return path.posix.join("img_game_logos");
  }

  if (endpoint.startsWith("/api/fighter_image")) {
    return path.posix.join(
      "img_fighters",
      req.body.id_fighter_version,
      req.body.image_type
    );
  }

  if (endpoint.startsWith("/api/fighter_moves")) {
    return command
      ? path.posix.join("img_move", req.body.id_fighter_version, "command")
      : path.posix.join("img_move", req.body.id_fighter_version, "execution");
  }

  return path.posix.join("defaults");
}

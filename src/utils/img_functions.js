import multer from "multer";
import fs from "fs";
import path from "path";
import { BASE_UPLOAD_PATH } from "./const-globales.js";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const folder = definirFolder(req);

    fs.mkdir(folder, { recursive: true }, (err) => {
      if (err) return cb(err);
      cb(null, folder);
    });
  },
  filename: function (req, file, cb) {
    const extension = file.originalname.split(".").pop();
    const imgDefName = definirNombre(req);
    const imgName = `${Date.now()}_${imgDefName}.${extension}`;

    cb(null, imgName);
  },
});

function definirFolder(req) {
  const endpointPath = req.originalUrl;
  let folder;

  if (endpointPath.startsWith("/api/games")) {
    folder = path.join(BASE_UPLOAD_PATH, "uploads", "img_game_logos");
  } else if (endpointPath.startsWith("/api/fighter_version")) {
    const idGame = req.body.idGame || "default";
    folder = path.join(
      BASE_UPLOAD_PATH,
      "uploads",
      "img_fighters",
      `SF${idGame}`
    );
  } else if (endpointPath.startsWith("/api/fighter_moves")) {
    folder = path.join(
      BASE_UPLOAD_PATH,
      "uploads",
      "img_fighters_moves",
      "fighter"
    );
  } else {
    folder = path.join(BASE_UPLOAD_PATH, "uploads", "defaults");
  }

  return folder;
}

function definirNombre(req) {
  const endpointPath = req.originalUrl;
  let name;

  if (endpointPath.startsWith("/api/games")) {
    name = `${req.body.short_title}`;
  } else if (endpointPath.startsWith("/api/fighter_versions")) {
    name = `${req.body.version_name}`;
  } else if (endpointPath.startsWith("/api/fighter_moves")) {
    name = `${req.body.name}`;
  } else {
    name = "image";
  }

  return name;
}

export default storage;

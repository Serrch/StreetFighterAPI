import multer from "multer";
import fs from "fs";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
    folder = path.resolve(__dirname, "..", "uploads", "img_game_logos");
  } else if (endpointPath.startsWith("/api/fighter_version")) {
    const idGame = req.body.idGame || "default";
    folder = path.resolve(
      __dirname,
      "..",
      "uploads",
      "img_fighters",
      `SF${idGame}`
    );
  } else if (endpointPath.startsWith("/api/fighter_moves")) {
    folder = path.resolve(
      __dirname,
      "..",
      "uploads",
      "img_fighters_moves",
      "fighter"
    );
  } else {
    folder = path.resolve(__dirname, "..", "uploads", "defaults");
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

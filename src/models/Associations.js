import Fighters from "./fighters.model.js";
import Games from "./games.model.js";
import FighterVersion from "./fighters_versions.model.js";
import FighterMove from "./fighter_moves.model.js";
import FighterImage from "./fighter_images.model.js";

FighterVersion.belongsTo(Fighters, {
  foreignKey: "id_fighter",
  as: "fighter",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Fighters.hasMany(FighterVersion, {
  foreignKey: "id_fighter",
  as: "versions",
});

FighterVersion.belongsTo(Games, {
  foreignKey: "id_game",
  as: "game",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Games.hasMany(FighterVersion, {
  foreignKey: "id_game",
  as: "fighter_versions",
});

FighterVersion.hasMany(FighterImage, {
  foreignKey: "id_fighter_version",
  as: "images",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

FighterImage.belongsTo(FighterVersion, {
  foreignKey: "id_fighter_version",
  as: "version",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

FighterVersion.hasMany(FighterMove, {
  foreignKey: "id_fighter_version",
  as: "moves",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

FighterMove.belongsTo(FighterVersion, {
  foreignKey: "id_fighter_version",
  as: "version",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

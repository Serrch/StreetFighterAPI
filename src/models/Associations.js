import Fighters from "./fighters.model.js";
import Games from "./games.model.js";
import FighterVersion from "./fighters_versions.model.js";

FighterVersion.belongsTo(Fighters, {
  foreignKey: "id_fighter",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Fighters.hasMany(FighterVersion, {
  foreignKey: "id_fighter",
});

FighterVersion.belongsTo(Games, {
  foreignKey: "id_game",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Games.hasMany(FighterVersion, {
  foreignKey: "id_game",
});

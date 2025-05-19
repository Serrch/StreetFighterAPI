import Fighters from "../models/fighters.model.js";
import Games from "../models/games.model.js";
import FighterVersion from "../models/fighters_versions.model.js";

export async function existId(endpoint, id) {
  const models = {
    fighters: Fighters,
    games: Games,
    fightersVersion: FighterVersion,
  };

  const Model = models[endpoint];
  if (!Model) return false;

  const record = await Model.findByPk(id);
  return !!record;
}

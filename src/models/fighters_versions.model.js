import { DataTypes } from "sequelize";
import sequelize from "../db.js";

const FighterVersion = sequelize.define(
  "fighters_versions",
  {
    id_fighter_version: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    id_fighter: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_game: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    version_name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  },
  {
    timestamps: false,
    tableName: "Fighters_versions",
  }
);

FighterVersion.getFighterVersion = async function () {
  return await this.findAll();
};

FighterVersion.getFighterVersionById = async function (id) {
  return await this.findByPk(id);
};

FighterVersion.insertFighterVersion = async function (fighterVersionData) {
  return await this.create(fighterVersionData);
};

FighterVersion.updateFighterVersion = async function (id, newData) {
  const fighterVersionData = await this.findByPk(id);
  if (!fighterVersionData) throw new Error("Version no encontrada");

  return await fighterVersionData.update(newData);
};

FighterVersion.deleteFighterVersion = async function (id) {
  const fighterVersionData = await this.findByPk(id);
  if (!fighterVersionData) throw new Error("Version no encontrada");

  await fighterVersionData.destroy();
  return { id };
};

export default FighterVersion;

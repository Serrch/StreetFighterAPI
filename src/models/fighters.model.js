import { DataTypes } from "sequelize";
import sequelize from "../db.js";
import FighterVersion from "./fighters_versions.model.js";

const Fighters = sequelize.define(
  "Fighters",
  {
    id_fighter: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    history: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    fighting_style: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    nationality: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
  },
  {
    tableName: "Fighters",
    timestamps: false,
  }
);

Fighters.getFighters = async function () {
  return await this.findAll();
};

Fighters.getFighterById = async function (id) {
  return await this.findByPk(id);
};

Fighters.insertFighter = async function (fighterData) {
  return await this.create(fighterData);
};

Fighters.updateFighter = async function (id, newData) {
  const fighter = await this.findByPk(id);
  if (!fighter) throw new Error("Peleador no encontrado");

  return await fighter.update(newData);
};

Fighters.deleteFighter = async function (id) {
  const fighter = await this.findByPk(id);
  if (!fighter) throw new Error("Peleador no encontrado");

  await fighter.destroy();
  return { id };
};

Fighters.getFighterWithVersionsAndImages = async function (id) {
  return await this.findByPk(id, {
    include: [
      {
        model: FighterVersion,
        as: "versions",
        include: [
          {
            model: FighterImage,
            as: "images",
          },
        ],
      },
    ],
  });
};

export default Fighters;

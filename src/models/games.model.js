import { DataTypes } from "sequelize";
import sequelize from "../db.js";

const Games = sequelize.define(
  "Games",
  {
    id_game: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    img_logo: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    short_title: {
      type: DataTypes.STRING(20),
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
  },
  {
    tableName: "Games",
    timestamps: false,
  }
);

Games.getGames = async function () {
  return await this.findAll();
};

Games.getGameById = async function (id) {
  return await this.findByPk(id);
};

Games.insertGame = async function (fighterData) {
  return await this.create(fighterData);
};

Games.updateGame = async function (id, newData) {
  const game = await this.findByPk(id);
  if (!game) throw new Error("Juego no encontrado");
  return await game.update(newData);
};

Games.deleteGame = async function (id) {
  const game = await this.findByPk(id);
  if (!game) throw new Error("Juego no encontrado");

  await game.destroy();
  return { id };
};

export default Games;

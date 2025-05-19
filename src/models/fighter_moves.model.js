import { DataTypes } from "sequelize";
import sequelize from "../db.js";

const FighterMove = sequelize.define(
  "fighter_moves",
  {
    id_fighter_move: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    id_fighter_version: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    img_command: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    img_execution: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    is_super_move: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  },
  {
    timestamps: false,
    tableName: "fighter_moves",
  }
);

FighterMove.getAllMoves = async function () {
  return await this.findAll();
};

FighterMove.getMoveById = async function (id) {
  return await this.findByPk(id);
};

FighterMove.insertMove = async function (moveData) {
  return await this.create(moveData);
};

FighterMove.updateMove = async function (id, newData) {
  const move = await this.findByPk(id);
  if (!move) throw new Error("Movimiento no encontrado");
  return await move.update(newData);
};

FighterMove.deleteMove = async function (id) {
  const move = await this.findByPk(id);
  if (!move) throw new Error("Movimiento no encontrado");
  await move.destroy();
  return { id };
};

export default FighterMove;

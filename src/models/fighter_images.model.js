import { DataTypes } from "sequelize";
import sequelize from "../db.js";

const FighterImage = sequelize.define(
  "fighter_images",
  {
    id_image: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    id_fighter_version: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    image_type: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  },
  {
    timestamps: false,
    tableName: "fighter_images",
  }
);

FighterImage.getFighterImages = async function () {
  return await this.findAll();
};

FighterImage.getFighterImageById = async function (id) {
  return await this.findByPk(id);
};

FighterImage.insertFighterImage = async function (imageData) {
  return await this.create(imageData);
};

FighterImage.updateFighterImage = async function (id, newData) {
  const image = await this.findByPk(id);
  if (!image) throw new Error("Imagen no encontrada");
  return await image.update(newData);
};

FighterImage.deleteFighterImage = async function (id) {
  const image = await this.findByPk(id);
  if (!image) throw new Error("Imagen no encontrada");
  await image.destroy();
  return { id };
};

export default FighterImage;

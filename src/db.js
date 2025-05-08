import { DB_USER, DB_PASSWORD, DB_HOST, DB_NAME, DB_PORT } from "./config.js";

import { Sequelize } from "sequelize";

export const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: "mysql",
});

try {
  await sequelize.authenticate();
  console.log("Conexión establecida correctamente");
  await sequelize.sync({ force: false });
} catch (error) {
  console.error("Error de conexión:", error);
}

export default sequelize;

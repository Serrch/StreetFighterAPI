import express from "express";
import path from "path";

import fighterRoutes from "./routes/fighters.routes.js";
import gamesRoutes from "./routes/games.routes.js";
import fighter_versionRoutes from "./routes/fighters_versions.routes.js";
import fighter_imageRoutes from "./routes/fighters_images.routes.js";
import fighter_movesRoutes from "./routes/fighters_moves.routes.js";
import "./models/Associations.js";

const app = express();

app.use(express.json());

app.use("/api", gamesRoutes);
app.use("/api", fighterRoutes);
app.use("/api", fighter_versionRoutes);
app.use("/api", fighter_imageRoutes);
app.use("/api", fighter_movesRoutes);

app.use("/uploads", express.static(path.resolve("src", "uploads")));

const port = process.env.PORT || 3002;

app.listen(port, () => console.log(`Server ON http://localhost:${port}`));

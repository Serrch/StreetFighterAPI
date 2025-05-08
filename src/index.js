import express from "express";
import router from "./routes/fighters.routes.js";

const app = express();

app.use(express.json());
app.use(router);

const port = process.env.PORT || 3002;

app.listen(port, () => console.log(`Server ON http://localhost:${port}`));

import routes from "./routes";
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import "@database";
import { iniciarEnvioAutomaticoDeLembretes } from "src/jobs/enviarLembretesAtrasados.job";
import { errorHandler } from "./middlewares/errorHandler";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(routes);
app.use(errorHandler);
app.use(express.static(__dirname + "/public"));

app.listen(process.env.SERVER_PORT || 3001, () => {
  console.log("📦 Server running");
});

iniciarEnvioAutomaticoDeLembretes();
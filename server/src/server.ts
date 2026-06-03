import routes from "./routes"
import dotenv from "dotenv"
import express from "express"
import cors from "cors"
import "@database"
import { errorHandler } from "./middlewares/errorHandler";

dotenv.config()

export const app = express()

app.use(cors())
app.use(express.json())
app.use(express.static(__dirname + "/public"))
app.use(routes)
app.use(errorHandler);


if (require.main === module) {
  const { iniciarEnvioAutomaticoDeLembretes } = require("src/jobs/sendOverdueReminders.job")
  app.listen(process.env.SERVER_PORT || 3001, () => {
    console.log("📦 Server running")
  })
  iniciarEnvioAutomaticoDeLembretes()
}
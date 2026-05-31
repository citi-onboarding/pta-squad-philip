import routes from "./routes"
import dotenv from "dotenv"
import express from "express"
import cors from "cors"
import "@database"

dotenv.config()

export const app = express()

app.use(cors())
app.use(express.json())
app.use(routes)
app.use(express.static(__dirname + "/public"))

if (require.main === module) {
  const { iniciarEnvioAutomaticoDeLembretes } = require("src/jobs/enviarLembretesAtrasados.job")
  app.listen(process.env.SERVER_PORT || 3001, () => {
    console.log("📦 Server running")
  })
  iniciarEnvioAutomaticoDeLembretes()
}
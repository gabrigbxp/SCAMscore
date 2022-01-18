require("dotenv").config();
import express from "express"
import apiRoutes from "./routes/apiRoutes";
import { errorUse } from "./middlewares/errorHandler"

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use("/api", apiRoutes)

app.use(errorUse)

const port = process.env.PORT || 8000
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})

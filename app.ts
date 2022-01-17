require("dotenv").config();
import express from "express"
import indexRoutes from "./routes/indexRoutes";

const app = express()

app.use("/api", indexRoutes)

const port = process.env.PORT || 8000
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})

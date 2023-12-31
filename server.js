import express, { json } from "express"
import { connect } from "mongoose"
import gamesRoutes from "./routes/gamesRoutes.js"
import judgesRoutes from "./routes/judgesRoutes.js"
import votesRoutes from "./routes/votesRoutes.js"
import authRouter from "./routes/authRoutes.js"
import cookieParser from "cookie-parser"
import cors from "cors"

const app = express()
const port = 3000

app.listen(port, () => {
    console.log("App funcionando en el puerto: ", port)
})

app.use(json())

app.use(cors())

app.use(cookieParser())

app.use("/api/games/", gamesRoutes)

app.use("/api/judges/", judgesRoutes)

app.use("/api/votes/", votesRoutes)

app.use("/api/auth/", authRouter)

app.get("/", (req, res) => {
    res.send("Bienvenido a mi API")
})

// mongoose connection
connect(
    "mongodb+srv://admin:admin@clusterlean.8tpqqpf.mongodb.net/goto-game-jam?retryWrites=true&w=majority"
).catch((error) => console.error(error))

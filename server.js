import express, { json } from "express"
import { connectDB } from "./db.js"
import gamesRoutes from "./routes/gamesRoutes.js"
import judgesRoutes from "./routes/judgesRoutes.js"
import votesRoutes from "./routes/votesRoutes.js"
import authRouter from "./routes/authRoutes.js"
import cookieParser from "cookie-parser"
import cors from "cors"

const app = express();
const port = 3000;

app.listen(port, () => {
    console.log("App working on the port: ", port)
})

connectDB();

app.use(json())

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))

app.use(cookieParser())

app.use("/api/games/", gamesRoutes)

app.use("/api/judges/", judgesRoutes)

app.use("/api/votes/", votesRoutes)

app.use("/api/auth/", authRouter)

app.get("/", (req, res) => {
    res.send("Welcome to my API :)")
});

// Importar express y json para crear el servidor
import express, { json } from "express"
// Importar la función para conectar a la base de datos
import { connectDB } from "./db.js"
// Importar las rutas de juegos
import gamesRoutes from "./routes/gamesRoutes.js"
// Importar las rutas de jueces
import judgesRoutes from "./routes/judgesRoutes.js"
// Importar las rutas de votos
import votesRoutes from "./routes/votesRoutes.js"
// Importar las rutas de autenticación (login, registro, etc)
import authRouter from "./routes/authRoutes.js"
// Importar cookie-parser para manejar cookies
import cookieParser from "cookie-parser"
// Importar cors para permitir peticiones desde el frontend
import cors from "cors"

// Crear la aplicación de Express
const app = express();
// Definir el puerto donde correrá el servidor
const port = 3000;

// Iniciar el servidor en el puerto 3000
app.listen(port, () => {
    console.log("App working on the port: ", port)
})

// Conectar a la base de datos MongoDB
connectDB();

// Middleware para poder leer JSON en las peticiones
app.use(json())

// Configurar CORS para permitir peticiones desde el frontend en localhost:5173
app.use(cors({
    origin: 'http://localhost:5173', // URL del frontend
    credentials: true // Permitir envío de cookies
}))

// Middleware para poder leer cookies en las peticiones
app.use(cookieParser())

// Registrar las rutas de juegos (GET, POST, etc)
app.use("/api/games/", gamesRoutes)

// Registrar las rutas de jueces
app.use("/api/judges/", judgesRoutes)

// Registrar las rutas de votos
app.use("/api/votes/", votesRoutes)

// Registrar las rutas de autenticación
app.use("/api/auth/", authRouter)

// Ruta raíz para verificar que el servidor está funcionando
app.get("/", (req, res) => {
    res.send("Welcome to my API :)")
});

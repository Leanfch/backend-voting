import { Router } from "express"
import {
    getAllGames,
    getGameById,
    updateGameById,
    getGamesByEditionSortedController,
    getAllGamesSortedByScoreController,
    // deleteGameById,
    createGame,
} from "../controllers/gamesController.js"
import { authRequire, requireRole } from "../middleware/validateToken.js"
const gamesRoutes = Router()

// crear un juego (solo usuarios)
gamesRoutes.post("", authRequire, requireRole('usuario'), createGame)

// traer todos los juegos (público)
gamesRoutes.get("", getAllGames)

// traer todos los juegos ordenados por puntuación (público)
gamesRoutes.get("/ranking", getAllGamesSortedByScoreController)

// traer todos los juegos de una edicion ordenados por puntaje (público)
gamesRoutes.get("/edition/:edition", getGamesByEditionSortedController)

// traer un juego por su id (público)
gamesRoutes.get("/:id", getGameById)

// actualizar un juego (solo usuarios)
gamesRoutes.put("", authRequire, requireRole('usuario'), updateGameById)

// borrar un juego
// gamesRoutes.delete("", deleteGameById);

export default gamesRoutes

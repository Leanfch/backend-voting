import express from "express"
import judgesSchema from "../models/judges.js"
import {
    createJudge,
    getJudges,
    postVote,
    getVotesByJudgeId,
    getVotesByGameId,
    getAverageScoresByGameId,
} from "../controllers/judgesController.js"
import { authRequire, requireRole } from "../middleware/validateToken.js"

const judgesRoutes = express.Router()

//traer los jueces (público)
judgesRoutes.get("/", getJudges)

// crear juez (solo admin)
judgesRoutes.post("/", authRequire, requireRole('admin'), createJudge)

// votar a un juego (solo jueces) [judgeId y gameId por el body]
judgesRoutes.post("/vote", authRequire, requireRole('juez'), postVote)

judgesRoutes.get("/judge/:judgeId", getVotesByJudgeId)

judgesRoutes.get("/game/:gameId", getVotesByGameId)

judgesRoutes.get("/averageScores/game/:gameId", getAverageScoresByGameId)

export default judgesRoutes

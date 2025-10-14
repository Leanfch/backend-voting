import judgesSchema from "../models/judges.js"
import {
    submitVote,
    getVotesByGame,
    getVotesByJudge,
    calculateAverageScoresForGame,
} from "../services/votesService.js"
import Game from "../models/games.js"

export const createJudge = async (req, res) => {
    const { name } = req.body
    const newJudge = new judgesSchema({ name })

    try {
        await newJudge.save()
        res.status(201).json(newJudge)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

export const getJudges = async (req, res) => {
    const findedJudges = await judgesSchema
        .find()
        .then((judges) => judges)
        .catch((error) => {
            return { message: error.message }
        })
    res.json(findedJudges)
}

export const postVote = async (req, res) => {
    const {
        gameplayPoints,
        artPoints,
        soundPoints,
        themePoints,
        gameId,
        judgeId,
    } = req.body

    try {
        const vote = await submitVote(
            judgeId,
            gameId,
            gameplayPoints,
            artPoints,
            soundPoints,
            themePoints
        )

        const totalVotePoints =
            gameplayPoints + artPoints + soundPoints + themePoints

        await Game.findByIdAndUpdate(gameId, {
            $inc: { totalPoints: totalVotePoints },
        })

        res.status(201).json(vote)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

export const getVotesByJudgeId = async (req, res) => {
    const { judgeId } = req.params

    try {
        const votes = await getVotesByJudge(judgeId)

        res.status(200).json(votes)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

export const getVotesByGameId = async (req, res) => {
    const { gameId } = req.params

    try {
        const votes = await getVotesByGame(gameId)

        res.status(200).json(votes)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

export const getAverageScoresByGameId = async (req, res) => {
    const { gameId } = req.params

    try {
        const scores = await calculateAverageScoresForGame(gameId)

        res.status(200).json(scores)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

import Vote from "../models/votes.js"
import User from "../models/users.js"
import Game from "../models/games.js"

const submitVote = async (
    judgeId,
    gameId,
    gameplayPoints,
    artPoints,
    soundPoints,
    themePoints
) => {
    // Buscar el usuario (juez) en lugar de la colección judges
    const judge = await User.findById(judgeId)
    const game = await Game.findById(gameId)

    if (!judge) {
        throw new Error("Juez no encontrado.")
    }

    if (!game) {
        throw new Error("Juego no encontrado.")
    }

    // Verificar que el usuario sea realmente un juez
    if (judge.role !== 'juez') {
        throw new Error("El usuario no tiene permisos para votar.")
    }

    const existingVote = await Vote.findOne({
        judgeId: judgeId,
        gameId: gameId,
    })

    if (existingVote) {
        throw new Error("Ya has votado por este juego.")
    }

    const newVote = new Vote({
        judgeId,
        gameId,
        gameplayPoints,
        artPoints,
        soundPoints,
        themePoints,
    })

    await newVote.save()

    return newVote
}

const getVotesByJudge = async (judgeId) => {
    const votes = await Vote.find({ judgeId: judgeId })
        .populate('gameId')
        .populate('judgeId', '-password')

    return votes
}

const getVotesByGame = async (gameId) => {
    const votes = await Vote.find({ gameId: gameId })
        .populate('judgeId', '-password')
        .populate('gameId')
    return votes
}

const calculateAverageScoresForGame = async (gameId) => {
    const votes = await Vote.find({ gameId: gameId })

    if (votes.length === 0) {
        return {
            averageGameplay: 0,
            averageArt: 0,
            averageSound: 0,
            averageTheme: 0,
        }
    }

    const totalVotes = votes.length
    const initialTotal = {
        totalGameplayPoints: 0,
        totalArtPoints: 0,
        totalSoundPoints: 0,
        totalThemePoints: 0,
    }

    const totals = votes.reduce((acc, vote) => {
        return {
            totalGameplayPoints: acc.totalGameplayPoints + vote.gameplayPoints,
            totalArtPoints: acc.totalArtPoints + vote.artPoints,
            totalSoundPoints: acc.totalSoundPoints + vote.soundPoints,
            totalThemePoints: acc.totalThemePoints + vote.themePoints,
        }
    }, initialTotal)

    return {
        averageGameplay: totals.totalGameplayPoints / totalVotes,
        averageArt: totals.totalArtPoints / totalVotes,
        averageSound: totals.totalSoundPoints / totalVotes,
        averageTheme: totals.totalThemePoints / totalVotes,
    }
}

export {
    submitVote,
    getVotesByGame,
    getVotesByJudge,
    calculateAverageScoresForGame,
}

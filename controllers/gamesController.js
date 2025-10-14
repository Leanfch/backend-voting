import {
    getGames,
    getGame,
    addGame,
    updateGame,
    getGamesByEditionSorted,
    getAllGamesSortedByScore,
    deleteGame,
} from "../services/gamesService.js"

const createGame = async (req, res) => {
    try {
        console.log('=== CREATING GAME ===')
        console.log('User from token:', req.user)
        console.log('Request body:', req.body)

        const createdGame = await addGame(req.body)

        console.log('Game created:', createdGame)
        console.log('===================')

        res.json(createdGame)
    } catch (error) {
        console.error('Error creating game:', error)
        res.status(500).json({ message: 'Error al crear el juego', error: error.message })
    }
}

const getAllGames = async (req, res) => {
    const findedGames = await getGames()
    res.json(findedGames)
}

const getGameById = async (req, res) => {
    const { id } = req.params
    const fetchedGame = await getGame(id)
    res.json(fetchedGame)
}

const updateGameById = async (req, res) => {
    const { id, name, genre, members, edition } = req.body
    const updatedGame = await updateGame(id, {
        name,
        genre,
        members,
        edition,
    })
    res.json(updatedGame)
}

const getGamesByEditionSortedController = async (req, res) => {
    const { edition } = req.params
    const games = await getGamesByEditionSorted(edition)
    res.json(games)
}

const getAllGamesSortedByScoreController = async (req, res) => {
    const games = await getAllGamesSortedByScore()
    res.json(games)
}

const deleteGameById = async (req, res) => {
    try {
        console.log('=== DELETING GAME ===')
        console.log('User from token:', req.user)
        console.log('Request body:', req.body)

        const { id } = req.body

        if (!id) {
            return res.status(400).json({ message: 'ID del juego es requerido' })
        }

        const deletedGame = await deleteGame(id)

        console.log('Game deleted:', deletedGame)
        console.log('===================')

        res.json({
            message: 'Juego eliminado correctamente',
            game: deletedGame
        })
    } catch (error) {
        console.error('Error deleting game:', error)
        res.status(500).json({
            message: 'Error al eliminar el juego',
            error: error.message
        })
    }
}

export {
    createGame,
    getAllGames,
    getGameById,
    updateGameById,
    getGamesByEditionSortedController,
    getAllGamesSortedByScoreController,
    deleteGameById
}

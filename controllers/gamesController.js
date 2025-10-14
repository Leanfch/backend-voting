import {
    getGames,
    getGame,
    addGame,
    updateGame,
    getGamesByEditionSorted,
    getAllGamesSortedByScore,
    // deleteGame,
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

// const deleteGameById = async (req, res) => {
//     const { id } = req.body;
//     const deletedGame = await deleteGame(id);
//     res.json(deletedGame);
// };

export {
    createGame,
    getAllGames,
    getGameById,
    updateGameById,
    getGamesByEditionSortedController,
    getAllGamesSortedByScoreController,
    // deleteGameById
}

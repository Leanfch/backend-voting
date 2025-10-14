import gameSchema from "../models/games.js"

const addGame = async (game) => {
    try {
        const newGame = new gameSchema(game)
        const savedGame = await newGame.save()
        return savedGame
    } catch (error) {
        return { message: error.message }
    }
}

const getGames = () => {
    return gameSchema
        .find()
        .then((games) => games)
        .catch((error) => {
            return { message: error.message }
        })
}

const getGame = (id) => {
    return gameSchema
        .findById(id)
        .then((games) => games)
        .catch((error) => {
            return { message: error.message }
        })
}

const updateGame = (id, game) => {
    return gameSchema
        .findOneAndUpdate(
            { _id: id },
            { $set: game },
            { returnOriginal: false }
        )
        .then((game) => game)
        .catch((error) => {
            return { message: error.message }
        })
}

const getGamesByEditionSorted = async (edition) => {
    return await gameSchema.find({ edition: edition }).sort({ totalPoints: -1 })
}

const getAllGamesSortedByScore = async () => {
    return await gameSchema.find().sort({ totalPoints: -1 })
}

// const deleteGame = (id) => {
//     return gameSchema
//         .findOneAndDelete({ _id: id })
//         .then((game) => game)
//         .catch((error) => {
//             return { message: error.message };
//         });
// };

export {
    addGame,
    getGames,
    getGame,
    updateGame,
    getGamesByEditionSorted,
    getAllGamesSortedByScore,
    // deleteGame
}

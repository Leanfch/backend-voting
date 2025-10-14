import { Schema, model } from "mongoose"

const gameSchema = Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    genre: {
        type: String,
        required: true,
        trim: true
    },
    members: {
        type: Array,
        required: false,
        default: []
    },
    edition: {
        type: Number,
        required: true,
    },
    totalPoints: {
        type: Number,
        default: 0,
    },
    photo: {
        type: String,
        required: false,
        default: ''
    }
})

const Game = model("Games", gameSchema)

export { gameSchema }
export default Game

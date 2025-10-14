import { Schema, model } from "mongoose"

const voteSchema = Schema({
    judgeId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    gameId: {
        type: Schema.Types.ObjectId,
        ref: 'Games',
        required: true,
    },
    gameplayPoints: {
        type: Number,
        min: 1,
        max: 10,
        required: true,
    },
    artPoints: {
        type: Number,
        min: 1,
        max: 10,
        required: true,
    },
    soundPoints: {
        type: Number,
        min: 1,
        max: 10,
        required: true,
    },
    themePoints: {
        type: Number,
        min: 1,
        max: 10,
        required: true,
    },
}, {
    timestamps: true
})

const Vote = model("Vote", voteSchema)

export default Vote

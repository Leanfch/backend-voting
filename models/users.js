import { Schema, model } from "mongoose"

const userSchema = Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    role: {
        type: String,
        enum: ['usuario', 'juez', 'admin'],
        default: 'usuario',
        required: true
    }
})

const User = model("User", userSchema)

export default User
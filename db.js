import mongoose from "mongoose"

export const connectDB = async () => {
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/goto-game-jam-db")
        .then(() => console.log("Connected to goto-game-jam-db"))
    } catch (error) {
        console.log("Error on DB initialization ", error)
    }
}

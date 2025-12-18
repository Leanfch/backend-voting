// Importar mongoose para conectarnos a MongoDB
import mongoose from "mongoose"

// Función asíncrona para conectar a la base de datos
export const connectDB = async () => {
    try {
        // Intentar conectar a MongoDB en localhost puerto 27017
        // La base de datos se llama "goto-game-jam-db"
        await mongoose.connect("mongodb://127.0.0.1:27017/goto-game-jam-db")
        .then(() => console.log("Connected to goto-game-jam-db"))
    } catch (error) {
        // Si hay error, mostrarlo en consola
        console.log("Error on DB initialization ", error)
    }
}

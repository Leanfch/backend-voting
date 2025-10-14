import mongoose from 'mongoose'
import User from '../models/users.js'

const addRoleToUsers = async () => {
    try {
        // Conectar a MongoDB
        await mongoose.connect('mongodb://127.0.0.1:27017/gamejam')
        console.log('Conectado a MongoDB')

        // Actualizar todos los usuarios que no tienen role
        const result = await User.updateMany(
            { role: { $exists: false } },
            { $set: { role: 'usuario' } }
        )

        console.log(`Se actualizaron ${result.modifiedCount} usuarios`)
        console.log('Migración completada exitosamente')

        // Cerrar conexión
        await mongoose.connection.close()
        process.exit(0)
    } catch (error) {
        console.error('Error en la migración:', error)
        process.exit(1)
    }
}

addRoleToUsers()

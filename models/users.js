// Importar Schema y model de mongoose para crear modelos
import { Schema, model } from "mongoose"

// Definir el esquema (estructura) de un usuario
const userSchema = Schema({
    // Campo: nombre del usuario
    name: {
        type: String,      // Tipo de dato: texto
        required: true,    // Es obligatorio
        trim: true        // Elimina espacios al inicio y final
    },
    // Campo: email del usuario
    email: {
        type: String,      // Tipo de dato: texto
        required: true,    // Es obligatorio
        unique: true,      // No puede haber dos usuarios con el mismo email
        trim: true        // Elimina espacios al inicio y final
    },
    // Campo: contraseña del usuario
    password: {
        type: String,      // Tipo de dato: texto
        required: true,    // Es obligatorio
        trim: true        // Elimina espacios al inicio y final
    },
    // Campo: rol del usuario (define sus permisos)
    role: {
        type: String,      // Tipo de dato: texto
        enum: ['usuario', 'juez', 'admin'], // Solo puede ser uno de estos valores
        default: 'usuario', // Si no se especifica, será 'usuario'
        required: true     // Es obligatorio
    }
})

// Crear el modelo User basado en el esquema
// Este modelo se usará para crear, leer, actualizar y eliminar usuarios
const User = model("User", userSchema)

// Exportar el modelo para usarlo en otros archivos
export default User
// Importar jsonwebtoken para crear tokens JWT
import jwt from "jsonwebtoken"

// Función para crear un token JWT
// Recibe un payload (datos que queremos guardar en el token)
export function createJWT(payload) {
    // Devolver una Promesa para poder usar async/await
    return new Promise((resolve, reject) => {
        // Crear el token con jwt.sign()
        jwt.sign(
            payload,          // Datos a guardar (ej: { id: "123", type: "login" })
            "secret123",      // Clave secreta para firmar el token (en producción debería ser más segura)
            {
                expiresIn: "1d", // El token expira en 1 día
            },
            (err, token) => {
                // Si hay error, mostrarlo
                if (err) console.log(err)
                // Devolver el token creado
                resolve(token)
            }
        )
    })
}

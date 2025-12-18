// Importar jsonwebtoken para verificar tokens JWT
import jwt from "jsonwebtoken"
// Importar el modelo de User para validar roles
import User from "../models/users.js"

// Middleware para verificar que el usuario esté autenticado
// Se usa en rutas protegidas que requieren login
export const authRequire = (req, res, next) => {
    // Obtener el token de las cookies
    const { token } = req.cookies

    // Si no hay token, devolver error 401 (No autorizado)
    if (!token) return res.status(401).json({ message: "You are not authorized for this app" })

    // Verificar que el token sea válido
    jwt.verify(token, "secret123", (error, user) => {
        // Si el token es inválido o expiró, devolver error
        if (error) return res.status(401).json({ message: "Invalid Token" })

        // Si el token es válido, guardar los datos del usuario en req.user
        // para que estén disponibles en las siguientes funciones
        req.user = user
        // Continuar con la siguiente función (next middleware o controlador)
        next()
    })
}

// Middleware para verificar que el usuario tenga un rol específico
// Ejemplo de uso: requireRole('admin') o requireRole('admin', 'juez')
export const requireRole = (...allowedRoles) => {
    // Devolver una función middleware
    return async (req, res, next) => {
        try {
            // Logs para debugging
            console.log('=== VALIDATING ROLE ===')
            console.log('User ID from token:', req.user.id)
            console.log('Allowed roles:', allowedRoles)

            // Buscar el usuario en la base de datos por su ID
            const user = await User.findById(req.user.id)

            // Si no se encuentra el usuario, devolver error 404
            if (!user) {
                console.log('User not found in database')
                return res.status(404).json({ message: "Usuario no encontrado" })
            }

            console.log('User role:', user.role)

            // Verificar si el rol del usuario está en la lista de roles permitidos
            if (!allowedRoles.includes(user.role)) {
                console.log('Role validation FAILED')
                // Si no tiene el rol correcto, devolver error 403 (Prohibido)
                return res.status(403).json({
                    message: "No tienes permisos para realizar esta acción",
                    requiredRole: allowedRoles,
                    userRole: user.role
                })
            }

            // Si tiene el rol correcto, continuar
            console.log('Role validation PASSED')
            console.log('======================')
            next()
        } catch (error) {
            console.error('Error validating role:', error)
            return res.status(500).json({ message: "Error al validar rol", error: error.message })
        }
    }
}

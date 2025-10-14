import jwt from "jsonwebtoken"
import User from "../models/users.js"

export const authRequire = (req, res, next) => {
    const { token } = req.cookies

    if (!token) return res.status(401).json({ message: "You are not authorized for this app" })

    jwt.verify(token, "secret123", (error, user) => {
        if (error) return res.status(401).json({ message: "Invalid Token" })

        req.user = user
        next()
    })
}

export const requireRole = (...allowedRoles) => {
    return async (req, res, next) => {
        try {
            console.log('=== VALIDATING ROLE ===')
            console.log('User ID from token:', req.user.id)
            console.log('Allowed roles:', allowedRoles)

            const user = await User.findById(req.user.id)

            if (!user) {
                console.log('User not found in database')
                return res.status(404).json({ message: "Usuario no encontrado" })
            }

            console.log('User role:', user.role)

            if (!allowedRoles.includes(user.role)) {
                console.log('Role validation FAILED')
                return res.status(403).json({
                    message: "No tienes permisos para realizar esta acción",
                    requiredRole: allowedRoles,
                    userRole: user.role
                })
            }

            console.log('Role validation PASSED')
            console.log('======================')
            next()
        } catch (error) {
            console.error('Error validating role:', error)
            return res.status(500).json({ message: "Error al validar rol", error: error.message })
        }
    }
}

import User from "../models/users.js"
import { createJWT } from "../helpers/jwt.js"

export const register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body

        const newUser = new User({ name, email, password, role: role || 'usuario' })

        const userSaved = await newUser.save()
        const token = await createJWT({ id: userSaved._id })
        res.cookie("token", token)
        res.json({
            id: userSaved._id,
            name: userSaved.name,
            email: userSaved.email,
            role: userSaved.role,
            token: token
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({
            message: error.message,
        })
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body

        const userFound = await User.findOne({ email })

        if (!userFound)
            return res.status(400).json({ message: "User not found, please type a valid user" })

        if (password === userFound.password) {
            const token = await createJWT({ id: userFound._id })
            res.cookie("token", token)
            res.json({
                id: userFound._id,
                name: userFound.name,
                email: userFound.email,
                role: userFound.role,
                token: token,
            })
        } else {
            return res.status(400).json({ message: "Password is invalid" })
        }
    } catch (error) {
        console.error(error)
        res.status(500).json({
            message: error.message,
        })
    }
}

export const logout = async (req, res) => {
    res.cookie("token", "")
    return res.status(200).json({ message: "You logged off succesfully" })
}

export const profile = async (req, res) => {
    const userFound = await User.findById(req.user.id)

    if (!userFound)
        return res.status(400).json({ message: "User not found" })
    return res.json({
        id: userFound._id,
        name: userFound.name,
        email: userFound.email,
        role: userFound.role,
    })
}

export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body

        const userFound = await User.findOne({ email })

        if (!userFound) {
            return res.status(404).json({ message: "Usuario no encontrado" })
        }

        // Crear token de recuperación con duración de 15 minutos
        const resetToken = await createJWT({ id: userFound._id, type: 'password-reset' })

        // En un entorno real, aquí se enviaría un email con el token
        // Por ahora, devolvemos el token directamente
        res.json({
            message: "Token de recuperación generado",
            resetToken: resetToken,
            // En producción, esto NO se debería enviar, solo por email
            resetUrl: `http://localhost:5173/auth/reset-password?token=${resetToken}`
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({
            message: error.message,
        })
    }
}

export const resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body

        if (!token || !newPassword) {
            return res.status(400).json({ message: "Token y nueva contraseña son requeridos" })
        }

        // Verificar el token
        const jwt = await import('jsonwebtoken')
        const decoded = jwt.default.verify(token, "secret123")

        if (decoded.type !== 'password-reset') {
            return res.status(400).json({ message: "Token inválido" })
        }

        const userFound = await User.findById(decoded.id)

        if (!userFound) {
            return res.status(404).json({ message: "Usuario no encontrado" })
        }

        // Actualizar la contraseña
        userFound.password = newPassword
        await userFound.save()

        res.json({ message: "Contraseña actualizada exitosamente" })
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(400).json({ message: "El token ha expirado" })
        }
        if (error.name === 'JsonWebTokenError') {
            return res.status(400).json({ message: "Token inválido" })
        }
        console.error(error)
        res.status(500).json({
            message: error.message,
        })
    }
}

// Endpoint para que el admin cree jueces
export const createUserByAdmin = async (req, res) => {
    try {
        console.log('=== ADMIN CREATING JUDGE ===')
        console.log('Admin user:', req.user)
        console.log('Request body:', req.body)

        const { name, email, password, role } = req.body

        // Validar que se proporcionen todos los campos
        if (!name || !email || !password) {
            return res.status(400).json({ message: "Todos los campos son requeridos (name, email, password)" })
        }

        // El admin solo puede crear jueces
        if (role && role !== 'juez') {
            return res.status(403).json({ message: "Los administradores solo pueden crear usuarios con rol de juez" })
        }

        // Verificar si el email ya existe
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.status(400).json({ message: "El email ya está registrado" })
        }

        // Siempre crear como juez
        const newUser = new User({ name, email, password, role: 'juez' })
        const userSaved = await newUser.save()

        console.log('Judge created successfully:', userSaved)
        console.log('========================')

        res.status(201).json({
            message: "Juez creado exitosamente",
            user: {
                id: userSaved._id,
                name: userSaved.name,
                email: userSaved.email,
                role: userSaved.role,
            }
        })
    } catch (error) {
        console.error('Error creating judge:', error)
        res.status(500).json({
            message: error.message,
        })
    }
}

// Endpoint para obtener todos los usuarios con rol de juez
export const getJudgeUsers = async (req, res) => {
    try {
        const judges = await User.find({ role: 'juez' }).select('-password')
        res.json(judges)
    } catch (error) {
        console.error('Error fetching judges:', error)
        res.status(500).json({
            message: error.message,
        })
    }
}

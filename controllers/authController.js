// Importar el modelo de User para interactuar con la base de datos
import User from "../models/users.js"
// Importar la función para crear tokens JWT
import { createJWT } from "../helpers/jwt.js"

// Función para registrar un nuevo usuario
export const register = async (req, res) => {
    try {
        // Obtener los datos del cuerpo de la petición
        const { name, email, password, role } = req.body

        // Crear un nuevo usuario con los datos recibidos
        // Si no se proporciona rol, por defecto será 'usuario'
        const newUser = new User({ name, email, password, role: role || 'usuario' })

        // Guardar el usuario en la base de datos
        const userSaved = await newUser.save()
        // Crear un token JWT con el ID del usuario
        const token = await createJWT({ id: userSaved._id })
        // Guardar el token en una cookie
        res.cookie("token", token, {
            httpOnly: false, // JavaScript puede acceder a la cookie
            secure: false,   // Permite HTTP (para desarrollo local)
            sameSite: 'lax', // Protección contra CSRF
            path: '/'        // Cookie disponible en toda la app
        })
        // Devolver los datos del usuario y el token
        res.json({
            id: userSaved._id,
            name: userSaved.name,
            email: userSaved.email,
            role: userSaved.role,
            token: token
        })
    } catch (error) {
        // Si hay error, mostrarlo y devolver mensaje de error
        console.error(error)
        res.status(500).json({
            message: error.message,
        })
    }
}

// Función para iniciar sesión (login)
export const login = async (req, res) => {
    try {
        // Obtener email y contraseña del cuerpo de la petición
        const { email, password } = req.body

        // Buscar el usuario en la base de datos por email
        const userFound = await User.findOne({ email })

        // Si no se encuentra el usuario, devolver error
        if (!userFound)
            return res.status(400).json({ message: "User not found, please type a valid user" })

        // Verificar si la contraseña coincide
        if (password === userFound.password) {
            // Crear un token JWT con el ID del usuario
            const token = await createJWT({ id: userFound._id })
            // Guardar el token en una cookie
            res.cookie("token", token, {
                httpOnly: false, // JavaScript puede acceder a la cookie
                secure: false,   // Permite HTTP (para desarrollo local)
                sameSite: 'lax', // Protección contra CSRF
                path: '/'        // Cookie disponible en toda la app
            })
            // Devolver los datos del usuario y el token
            res.json({
                id: userFound._id,
                name: userFound.name,
                email: userFound.email,
                role: userFound.role,
                token: token,
            })
        } else {
            // Si la contraseña no coincide, devolver error
            return res.status(400).json({ message: "Password is invalid" })
        }
    } catch (error) {
        // Si hay error, mostrarlo y devolver mensaje de error
        console.error(error)
        res.status(500).json({
            message: error.message,
        })
    }
}

// Función para cerrar sesión (logout)
export const logout = async (req, res) => {
    // Borrar la cookie estableciendo un valor vacío y maxAge en 0
    res.cookie("token", "", {
        httpOnly: false,
        secure: false,
        sameSite: 'lax',
        path: '/',
        maxAge: 0 // Expira inmediatamente
    })
    // Devolver mensaje de éxito
    return res.status(200).json({ message: "You logged off succesfully" })
}

// Función para obtener el perfil del usuario autenticado
export const profile = async (req, res) => {
    // Buscar el usuario por ID (el ID viene del token JWT decodificado)
    const userFound = await User.findById(req.user.id)

    // Si no se encuentra el usuario, devolver error
    if (!userFound)
        return res.status(400).json({ message: "User not found" })
    // Devolver los datos del usuario (sin la contraseña)
    return res.json({
        id: userFound._id,
        name: userFound.name,
        email: userFound.email,
        role: userFound.role,
    })
}

// Función para solicitar recuperación de contraseña (olvidé mi contraseña)
export const forgotPassword = async (req, res) => {
    try {
        // Obtener el email del cuerpo de la petición
        const { email } = req.body

        // Buscar el usuario por email
        const userFound = await User.findOne({ email })

        // Si no se encuentra el usuario, devolver error
        if (!userFound) {
            return res.status(404).json({ message: "Usuario no encontrado" })
        }

        // Crear token de recuperación con duración de 15 minutos
        // Este token es especial y solo sirve para resetear la contraseña
        const resetToken = await createJWT({ id: userFound._id, type: 'password-reset' })

        // En un entorno real, aquí se enviaría un email con el token
        // Por ahora, devolvemos el token directamente (solo para desarrollo)
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

// Función para resetear la contraseña usando el token de recuperación
export const resetPassword = async (req, res) => {
    try {
        // Obtener el token y la nueva contraseña del cuerpo de la petición
        const { token, newPassword } = req.body

        // Validar que se proporcionen ambos campos
        if (!token || !newPassword) {
            return res.status(400).json({ message: "Token y nueva contraseña son requeridos" })
        }

        // Importar jsonwebtoken para verificar el token
        const jwt = await import('jsonwebtoken')
        // Decodificar y verificar el token
        const decoded = jwt.default.verify(token, "secret123")

        // Verificar que el token sea de tipo 'password-reset'
        if (decoded.type !== 'password-reset') {
            return res.status(400).json({ message: "Token inválido" })
        }

        // Buscar el usuario por ID (viene del token decodificado)
        const userFound = await User.findById(decoded.id)

        // Si no se encuentra el usuario, devolver error
        if (!userFound) {
            return res.status(404).json({ message: "Usuario no encontrado" })
        }

        // Actualizar la contraseña del usuario
        userFound.password = newPassword
        await userFound.save()

        // Devolver mensaje de éxito
        res.json({ message: "Contraseña actualizada exitosamente" })
    } catch (error) {
        // Si el token ha expirado
        if (error.name === 'TokenExpiredError') {
            return res.status(400).json({ message: "El token ha expirado" })
        }
        // Si el token es inválido
        if (error.name === 'JsonWebTokenError') {
            return res.status(400).json({ message: "Token inválido" })
        }
        console.error(error)
        res.status(500).json({
            message: error.message,
        })
    }
}

// Función para que el administrador pueda crear jueces
export const createUserByAdmin = async (req, res) => {
    try {
        // Logs para debugging (ver quién está creando el juez)
        console.log('=== ADMIN CREATING JUDGE ===')
        console.log('Admin user:', req.user)
        console.log('Request body:', req.body)

        // Obtener los datos del cuerpo de la petición
        const { name, email, password, role } = req.body

        // Validar que se proporcionen todos los campos requeridos
        if (!name || !email || !password) {
            return res.status(400).json({ message: "Todos los campos son requeridos (name, email, password)" })
        }

        // El admin solo puede crear jueces (no admins ni usuarios)
        if (role && role !== 'juez') {
            return res.status(403).json({ message: "Los administradores solo pueden crear usuarios con rol de juez" })
        }

        // Verificar si el email ya está en uso
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.status(400).json({ message: "El email ya está registrado" })
        }

        // Crear el nuevo usuario siempre con rol 'juez'
        const newUser = new User({ name, email, password, role: 'juez' })
        const userSaved = await newUser.save()

        // Logs de éxito
        console.log('Judge created successfully:', userSaved)
        console.log('========================')

        // Devolver el usuario creado (sin contraseña)
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

// Función para obtener todos los usuarios con rol de juez
export const getJudgeUsers = async (req, res) => {
    try {
        // Buscar todos los usuarios que tengan rol 'juez'
        // .select('-password') excluye la contraseña del resultado
        const judges = await User.find({ role: 'juez' }).select('-password')
        // Devolver la lista de jueces
        res.json(judges)
    } catch (error) {
        console.error('Error fetching judges:', error)
        res.status(500).json({
            message: error.message,
        })
    }
}

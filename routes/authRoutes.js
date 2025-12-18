// Importar Router de express para crear rutas
import { Router } from "express"
// Importar todas las funciones del controlador de autenticación
import {
    register,
    login,
    logout,
    profile,
    forgotPassword,
    resetPassword,
    createUserByAdmin,
    getJudgeUsers,
} from "../controllers/authController.js"
// Importar middlewares para proteger rutas
import { authRequire, requireRole } from "../middleware/validateToken.js"

// Crear el router de autenticación
const authRouter = Router()

// Ruta POST para registrar un nuevo usuario
authRouter.post("/register", register)

// Ruta POST para iniciar sesión
authRouter.post("/login", login)

// Ruta POST para cerrar sesión
authRouter.post("/logout", logout)

// Ruta GET para obtener el perfil del usuario autenticado
// authRequire verifica que el usuario tenga un token válido
authRouter.get("/profile", authRequire, profile)

// Ruta POST para solicitar recuperación de contraseña
authRouter.post("/forgot-password", forgotPassword)

// Ruta POST para resetear la contraseña con el token
authRouter.post("/reset-password", resetPassword)

// Ruta POST para que el admin pueda crear jueces
// authRequire verifica que esté autenticado
// requireRole('admin') verifica que sea administrador
authRouter.post("/admin/create-user", authRequire, requireRole('admin'), createUserByAdmin)

// Ruta GET para obtener todos los usuarios con rol de juez
authRouter.get("/users/judges", getJudgeUsers)

// Exportar el router para usarlo en server.js
export default authRouter

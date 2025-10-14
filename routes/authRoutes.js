import { Router } from "express"
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
import { authRequire, requireRole } from "../middleware/validateToken.js"

const authRouter = Router()

authRouter.post("/register", register)
authRouter.post("/login", login)
authRouter.post("/logout", logout)
authRouter.get("/profile", authRequire, profile)
authRouter.post("/forgot-password", forgotPassword)
authRouter.post("/reset-password", resetPassword)

// Endpoint para que el admin cree usuarios (especialmente jueces)
authRouter.post("/admin/create-user", authRequire, requireRole('admin'), createUserByAdmin)

// Endpoint para obtener todos los usuarios con rol de juez
authRouter.get("/users/judges", getJudgeUsers)

export default authRouter

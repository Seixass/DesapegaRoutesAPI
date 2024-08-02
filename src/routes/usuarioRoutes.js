import { Router } from "express";

// Import controllers
import {
    register,
    login,
    checkUser
} from "../controllers/usuarioController.js";

// Import middleware
import validarUsuario from "../helpers/validar-user.js";

const router = Router();

// Route to register a user
router.post("/register", validarUsuario, register);

// Route to log in a user
router.post("/login", login);

// Route to check user details
router.get("/:id", checkUser);

export default router;

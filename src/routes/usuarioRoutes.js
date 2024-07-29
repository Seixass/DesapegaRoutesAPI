import { Router } from "express";

//importar controller de usaurio
import { register } from "../controllers/usuarioController.js"

//importar os helpers
import validarUsuario from "../helpers/validar-user.js";

const router = Router()

//localhost:9090//usuarios/register
router.post("/register", validarUsuario, register)

export default router;
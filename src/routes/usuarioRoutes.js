import { Router } from "express";
import { register, login, checkUser, getUserById, editUser } from "../controllers/UsuarioController.js";
import verifyToken from "../helpers/verifyToken.js";
import validarUsuario from "../helpers/validar-user.js";
import imageUpload from "../helpers/image-upload.js";

const router = Router();

router.post("/register", validarUsuario, register);
router.post("/login", login);
router.get("/checkUser", verifyToken, checkUser);
router.get("/:id", getUserById);
router.put("/edit/:id", verifyToken, imageUpload.single("imagem"), editUser);

export default router;

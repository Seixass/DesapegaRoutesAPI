import { Router } from "express";

import { create, getAllObjectUser } from "../controllers/objetoController.js"

import imageUpload from "../helpers/image-upload.js";
import verifyToken from "../helpers/verifyToken.js";

const router = Router()
router.post("/create", verifyToken, imageUpload.array("imagens", 10), create)
//listar todos os objetos
//listar todas as imagens de um objeto
//listar todos as iamgens que pertence ao usuario
//resgatar objeto pelo id
router.get("/usuarios/imagens", verifyToken,getAllObjectUser)

export default router;
import multer from "multer";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename)

//Função para falar onde irei guardar as imagens
const imageStore = multer.diskStorage({
    destination: (req, file, cb) => {
        let folter = ""

        if (req.baseUrl.includes("usuarios")) {
            folter = "usuarios"
        } else if (req.baseUrl.includes("objetos")) {
            folter = "objetos"
        }
        cb(null, path.join(__dirname, `../public/${folter}`))

    },
    filename: (req, file, cb) => {
        cb(null,
        Date.now() +
        String(Math.floor(Math.random() * 100000)) +
        path.extname(file.originalname))
    }
});

const imageUpload = multer ({
    storage: imageStore, 
    fileFilter(req, file, cb){
        if(!file.originalname.match(/\.(png||jpg)$/)){
            return cb(new Error("Por favor, envie apenas jpg ou png!"))
        }cb(null, true)
    },
});

export default imageUpload;
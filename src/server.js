import "dotenv/config";
import express from "express";

const PORT = process.env.PORT;

//importar conexão 
import conn from "./config/conn.js"

//importação dos módulos (tabela) 
import "./models/usuarioModel.js"
import "./models/objetoModel.js"
import "./models/objetoImagesModel.js"

//importação de rotas
import usuarioRouter from "./routes/usuarioRoutes.js"
import objetoRouter from "./routes/objetoRoutes.js"

const app = express();

app.use(express.urlencoded({extended:true}))
app.use(express.json())

//Utilizar a Rota
app.use('/usuarios', usuarioRouter)
app.use('/objetos', objetoRouter)

//404
app.use((request, response)=>{
    response.status(404).json({msg: 'Recurso não encontrado'})
})

//404
// app.get("*", (request, response) => {
//   response.send("Olá, mundo!");
// });

app.listen(PORT, () => {
  console.log("Servidor on PORT " +PORT );
});

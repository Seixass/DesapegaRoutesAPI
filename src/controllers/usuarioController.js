import conn from "../config/conn.js";
import bcrypt from "bcrypt";
import { response } from "express";
import {v4 as uuidv4}  from "uuid";

export const register = async (req, res) => {
    const { nome, email, telefone, senha, confirmsenha } = req.body;

    // Verificar se o e-mail já está em uso
    const checkEmailSQL = /*sql*/`SELECT * FROM usuarios WHERE ?? = ?`;
    const checkEmailData = ["email", email];
    
    conn.query(checkEmailSQL, checkEmailData, async (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: "Não foi possível buscar usuário" });
            return;
        }
        
        if (data.length > 0) {
            res.status(409).json({ error: "E-mail já está em uso!" });
            return;
        }

        //CRIAR A SENHA DO USUÁRIO
        const salt = await bcrypt.genSalt(12)
        const senhaHash = await bcrypt.hash(senha, salt)
        // console.log(salt)
        // console.log("senha recebida:", senha)
        // console.log("Senha Criptografada:", senhaHash)

        //CADASTRAR USUARIO
        const id = uuidv4();
        const imagem = 'userDefault.png';

        const insertSql=/*sql*/`INSERT INTO usuarios
            (??, ??, ??, ??, ??, ??) VALUES (?, ?, ?, ?, ?, ?)
        `
            const insertData = ["usuario_id", "nome", "email", "telefone", "senha", "imagem", 
        id, nome, email, telefone, senhaHash, imagem]
        conn.query(insertSql, insertData, (err)=>{
            if(err){
                res.status(500).json({err: "Eroo ao cadastrar usuário"})
                return
            }

            res.status(201).json({msg:"Usuário cadastrado com sucesso"})
        })
        

    });
};
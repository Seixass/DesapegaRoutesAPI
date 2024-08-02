import conn from "../config/conn.js";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";
import getToken from "../helpers/getToken.js";
import createUserToken from "../helpers/createUserToken.js";

// Define the secret key for JWT
const JWT_SECRET = "S4e@F5r&1#qP7k9V!zE2*Jx3WdL8uC^bT@o8gL2yR!mF4^Nx7"; 

export const register = async (req, res) => {
    const { nome, email, telefone, senha } = req.body;

    // Validate required fields
    if (!nome || !email || !telefone || !senha) {
        return res.status(400).json({ error: "Todos os campos são obrigatórios" });
    }

    // Check if the email is already in use
    const checkEmailSQL = "SELECT * FROM usuarios WHERE email = ?";
    conn.query(checkEmailSQL, [email], async (err, data) => {
        if (err) {
            console.error("Erro ao buscar usuário:", err);
            return res.status(500).json({ error: "Não foi possível verificar o e-mail" });
        }

        if (data.length > 0) {
            return res.status(409).json({ error: "E-mail já está em uso!" });
        }

        // Hash the user's password
        try {
            const salt = await bcrypt.genSalt(12);
            const senhaHash = await bcrypt.hash(senha, salt);

            // Register the user
            const id = uuidv4();
            const imagem = ""; // Default image or empty
            const insertSql = `
                INSERT INTO usuarios (usuario_id, nome, email, telefone, senha, imagem) 
                VALUES (?, ?, ?, ?, ?, ?)`;
            const insertData = [id, nome, email, telefone, senhaHash, imagem];

            conn.query(insertSql, insertData, (err) => {
                if (err) {
                    console.error("Erro ao cadastrar usuário:", err);
                    return res.status(500).json({ error: "Erro ao cadastrar usuário" });
                }

                // Respond with a success message
                res.status(201).json({ message: "Registro realizado com sucesso! Faça login para obter o token." });
            });
        } catch (error) {
            console.error("Erro ao processar a senha:", error);
            res.status(500).json({ error: "Erro ao processar a senha" });
        }
    });
};

export const login = (req, res) => {
    const { email, senha } = req.body;

    // Validate required fields
    if (!email || !senha) {
        return res.status(400).json({ error: "E-mail e senha são obrigatórios" });
    }

    // Check if the user exists
    const checkSql = "SELECT * FROM usuarios WHERE email = ?";
    conn.query(checkSql, [email], async (err, data) => {
        if (err) {
            console.error("Erro ao buscar usuário:", err);
            return res.status(500).json({ error: "Erro ao buscar usuário" });
        }

        if (data.length === 0) {
            return res.status(401).json({ message: "Usuário não encontrado" });
        }

        const user = data[0];
        
        try {
            const isPasswordValid = await bcrypt.compare(senha, user.senha);
            if (!isPasswordValid) {
                return res.status(401).json({ message: "Senha inválida" });
            }
            await createUserToken(user, res);
        } catch (error) {
            console.error("Erro ao comparar senha:", error);
            res.status(500).json({ error: "Erro ao tentar fazer login" });
        }
    });
};

export const checkUser = (req, res) => {
    try {
        const token = getToken(req);
        if (!token) {
            return res.status(401).json({ message: "Token não fornecido" });
        }

        // Decode the token
        const decoded = jwt.verify(token, JWT_SECRET);
        const userId = decoded.id;

        // Fetch user data
        const userSql = "SELECT * FROM usuarios WHERE usuario_id = ?";
        conn.query(userSql, [userId], (err, data) => {
            if (err) {
                console.error("Erro ao buscar dados do usuário:", err);
                return res.status(500).json({ message: "Erro ao buscar dados do usuário" });
            }

            if (data.length === 0) {
                return res.status(404).json({ message: "Usuário não encontrado" });
            }

            // Return the user data
            res.status(200).json(data[0]);
        });
    } catch (error) {
        console.error("Erro ao verificar o token:", error);
        res.status(401).json({ message: "Token inválido" });
    }
};

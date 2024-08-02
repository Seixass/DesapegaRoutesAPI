import conn from "../config/conn.js";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";
import getToken from "../helpers/getToken.js";
import createUserToken from "../helpers/createUserToken.js";

const JWT_SECRET = process.env.JWT_SECRET || "S4e@F5r&1#qP7k9V!zE2*Jx3WdL8uC^bT@o8gL2yR!mF4^Nx7";

export const register = async (req, res) => {
    const { nome, email, telefone, senha, confirmsenha } = req.body;

    // Validate required fields
    if (!nome || !email || !telefone || !senha || !confirmsenha) {
        return res.status(400).json({ error: "Todos os campos são obrigatórios" });
    }

    if (senha !== confirmsenha) {
        return res.status(409).json({ error: "A senha e confirmação da senha devem ser iguais" });
    }

    if (!email.includes("@")) {
        return res.status(409).json({ error: "O e-mail deve conter '@'" });
    }

    const checkEmailSQL = "SELECT * FROM usuarios WHERE email = ?";
    conn.query(checkEmailSQL, [email], async (err, data) => {
        if (err) {
            console.error("Erro ao buscar usuário:", err);
            return res.status(500).json({ error: "Não foi possível verificar o e-mail" });
        }

        if (data.length > 0) {
            return res.status(409).json({ error: "E-mail já está em uso!" });
        }

        try {
            const salt = await bcrypt.genSalt(12);
            const senhaHash = await bcrypt.hash(senha, salt);
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

    if (!email || !senha) {
        return res.status(400).json({ error: "E-mail e senha são obrigatórios" });
    }

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

        const decoded = jwt.verify(token, JWT_SECRET);
        const userId = decoded.id;

        const userSql = "SELECT * FROM usuarios WHERE usuario_id = ?";
        conn.query(userSql, [userId], (err, data) => {
            if (err) {
                console.error("Erro ao buscar dados do usuário:", err);
                return res.status(500).json({ message: "Erro ao buscar dados do usuário" });
            }

            if (data.length === 0) {
                return res.status(404).json({ message: "Usuário não encontrado" });
            }

            res.status(200).json(data[0]);
        });
    } catch (error) {
        console.error("Erro ao verificar o token:", error);
        res.status(401).json({ message: "Token inválido" });
    }
};

export const getUserById = (req, res) => {
    const { id } = req.params;

    const checkSql = `
    SELECT usuario_id, nome, email, telefone, imagem
    FROM usuarios
    WHERE usuario_id = ?
    `;

    conn.query(checkSql, [id], (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ msg: "Erro ao buscar usuário" });
        }
        if (data.length === 0) {
            return res.status(404).json({ msg: "Usuário não encontrado" });
        }

        const usuario = data[0];
        res.status(200).json(usuario);
    });
};

export const editUser = async (req, res) => {
    const { id } = req.params;
    const { nome, email, telefone, senha } = req.body;

    const token = getToken(req);

    if (!token) {
        return res.status(401).json({ message: "Token não fornecido" });
    }

    try {
        // Fetch the user from the token
        const userFromToken = await getUserByToken(token);

        // Check if the user from the token matches the user being updated
        if (userFromToken.usuario_id !== id) {
            return res.status(403).json({ message: "Você não tem permissão para editar este usuário" });
        }

        // Check if the new email is already in use
        if (email) {
            const [existingUser] = await new Promise((resolve, reject) => {
                conn.query('SELECT usuario_id FROM usuarios WHERE email = ? AND usuario_id != ?', [email, id], (err, results) => {
                    if (err) reject(err);
                    else resolve(results);
                });
            });

            if (existingUser) {
                return res.status(400).json({ message: "Este e-mail já está em uso" });
            }
        }

        const updateData = [nome, email, telefone];
        let updateSql = `
            UPDATE usuarios
            SET nome = ?, email = ?, telefone = ?
        `;
        
        if (senha) {
            const salt = await bcrypt.genSalt(12);
            const senhaHash = await bcrypt.hash(senha, salt);
            updateData.push(senhaHash);
            updateSql += ", senha = ?";
        }
        
        updateSql += " WHERE usuario_id = ?";
        updateData.push(id);

        conn.query(updateSql, updateData, (err) => {
            if (err) {
                console.error("Erro ao atualizar usuário:", err);
                return res.status(500).json({ msg: "Erro ao atualizar usuário" });
            }

            res.status(200).json({ msg: "Usuário atualizado com sucesso" });
        });
    } catch (error) {
        console.error("Erro ao verificar o token:", error);
        res.status(401).json({ message: "Token inválido" });
    }
};
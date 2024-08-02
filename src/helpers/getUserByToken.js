import jwt from "jsonwebtoken";
import conn from "../config/conn.js";

const getUserByToken = async (token) => {
    try {
        if (!token) {
            throw new Error("Token não fornecido");
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;

        const checkSql = "SELECT * FROM usuarios WHERE usuario_id = ?";
        return new Promise((resolve, reject) => {
            conn.query(checkSql, [userId], (err, data) => {
                if (err) {
                    return reject(err);
                }
                if (data.length === 0) {
                    return reject(new Error("Usuário não encontrado"));
                }
                resolve(data[0]);
            });
        });
    } catch (error) {
        throw new Error("Token inválido");
    }
};

export default getUserByToken;
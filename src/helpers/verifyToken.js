import jwt from "jsonwebtoken";
import getToken from "./getToken.js";

const verifyToken = (req, res, next) => {
    try {
        const token = getToken(req);
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "S4e@F5r&1#qP7k9V!zE2*Jx3WdL8uC^bT@o8gL2yR!mF4^Nx7");
        req.user = decoded; // Attach the user information to the request
        next();
    } catch (error) {
        console.error("Erro ao verificar o token:", error);
        res.status(401).json({ error: "Token inválido" });
    }
};

export default verifyToken;

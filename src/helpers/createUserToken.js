import jwt from "jsonwebtoken";

const createUserToken = async (user, res) => {
    try {
        // Get the secret key from environment variables
        const secretKey = process.env.JWT_SECRET || "SENHASUPERSEGURAEDIFICIL";

        // Create the token
        const token = jwt.sign(
            {
                nome: user.nome,
                id: user.usuario_id
            },
            secretKey,
            { expiresIn: '1h' } // Token expiration time
        );

        // Return the token and user ID
        res.status(200).json({
            msg: "Você está logado!",
            token,
            usuarioID: user.usuario_id
        });
    } catch (error) {
        console.error("Erro ao criar o token:", error);
        res.status(500).json({ msg: "Erro ao criar o token" });
    }
};

export default createUserToken;

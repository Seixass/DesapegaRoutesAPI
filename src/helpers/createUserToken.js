import jwt from "jsonwebtoken";

const createUserToken = async (user, res) => {
    try {
        const secretKey = process.env.JWT_SECRET || "SENHASUPERSEGURAEDIFICIL";
        const token = jwt.sign(
            {
                nome: user.nome,
                id: user.usuario_id
            },
            secretKey,
        );

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

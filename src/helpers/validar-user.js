const validarUsuario = (req, res, next) => {
    const { nome, email, telefone, senha, confirmsenha } = req.body;

    if (!nome) {
        return res.status(400).json({ msg: "O nome é obrigatório" });
    }
    if (!email) {
        return res.status(400).json({ msg: "O email é obrigatório" });
    }
    if (!telefone) {
        return res.status(400).json({ msg: "O telefone é obrigatório" });
    }
    if (!senha) {
        return res.status(400).json({ msg: "A senha é obrigatória" });
    }
    if (!confirmsenha) {
        return res.status(400).json({ msg: "A confirmação da senha é obrigatória" });
    }
    if (!email.includes("@")) {
        return res.status(409).json({ msg: "O e-mail deve conter '@'" });
    }
    if (senha !== confirmsenha) {
        return res.status(409).json({ msg: "A senha e confirmação da senha devem ser iguais" });
    }

    next();
};

export default validarUsuario;

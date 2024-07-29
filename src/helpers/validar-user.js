import { response } from "express"

    const validarUsuario = (req, res, next) => {
    const {nome, email, telefone, senha, confirmsenha} = req.body

    if(!nome){
        res.status(400).json({msg:"O nome é obrigatório"});
        return;
    }
    if(!email){
        res.status(400).json({msg:"O email é obrigatório"});
        return;
    }
    if(!telefone){
        res.status(400).json({msg:"O telefone é obrigatório"});
        return;
    }
    if(!senha){
        res.status(400).json({msg:"A senha é obrigatório"});
        return;
    }
    if(!confirmsenha){
        res.status(400).json({msg:"A confirmação da senha é obrigatório"});
        return;
    }
    if(!email.includes("@")){
        res.status(409).json({msg: "deve conter @ do email"});
        return;
    }
    if(senha !== confirmsenha){
        res.status(409).json({msg: "A senha e confirmação de senha deve ser iguais"});
        return;
    }

    next() 

}

export default validarUsuario;
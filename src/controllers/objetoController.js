import conn from "../config/conn.js";
import { v4 as uuidv4 } from "uuid";
import getToken from "../helpers/getToken.js";
import getUserByToken from "../helpers/getUserByToken.js";

export const create = async (req, res) => {
    const { nome, peso, cor, descricao } = req.body;
    const disponivel = 1;

    if (!nome || nome.length < 3) {
        return res.status(400).json("O nome do objeto é obrigatório e deve ter pelo menos 3 caracteres.");
    }
    if (!peso) {
        return res.status(400).json("O peso do objeto é obrigatório.");
    }
    if (!cor) {
        return res.status(400).json("A cor do objeto é obrigatória.");
    }
    if (!descricao) {
        return res.status(400).json("A descrição do objeto é obrigatória.");
    }

    try {
        const token = getToken(req);
        const user = await getUserByToken(token);
        const usuario_id = user.usuario_id;
        const objeto_id = uuidv4();

        const insertSql = /*sql*/`
            INSERT INTO objetos (objeto_id, nome, peso, cor, descricao, disponivel, usuario_id)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        const insertData = [objeto_id, nome, peso, cor, descricao, disponivel, usuario_id];

        conn.query(insertSql, insertData, (err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ err: "Erro ao cadastrar objeto" });
            }

            if (req.files && req.files.length > 0) {
                const insertImageSql = /*sql*/`
                    INSERT INTO objeto_images (image_id, objeto_id, image_path)
                    VALUES ?
                `;
                const imageValues = req.files.map((file) => [
                    uuidv4(),
                    objeto_id,
                    file.filename
                ]);

                conn.query(insertImageSql, [imageValues], (err) => {
                    if (err) {
                        console.error(err);
                        return res.status(500).json({ err: "Erro ao salvar imagens do objeto" });
                    }
                    res.status(201).json("Objeto cadastrado com sucesso!");
                });
            } else {
                res.status(201).json("Objeto cadastrado com sucesso!");
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ err: "Erro ao processar o request" });
    }
};

export const getAllObjectUser = async (req, res) => {
    try {
        const token = getToken(req);
        const user = await getUserByToken(token);

        const usuarioID = user.usuario_id;
        const selectSql = /*sql*/`
            SELECT
                obj.objeto_id,
                obj.usuario_id,
                obj.nome,
                obj.peso,
                obj.cor, 
                obj.descricao,
                GROUP_CONCAT(obj_img.image_path SEPARATOR ',') AS image_path
            FROM 
                objetos AS obj
            LEFT JOIN
                objeto_images AS obj_img ON obj.objeto_id = obj_img.objeto_id
            WHERE 
                obj.usuario_id = ?
            GROUP BY
                obj.objeto_id, obj.usuario_id, obj.nome, obj.peso, obj.cor, obj.descricao
        `;

        conn.query(selectSql, [usuarioID], (err, data) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ err: "Erro ao buscar objetos" });
            }

            const objetoUsuario = data.map((obj) => ({
                objeto_id: obj.objeto_id,
                usuario_id: obj.usuario_id,
                nome: obj.nome,
                peso: obj.peso,
                cor: obj.cor,
                descricao: obj.descricao,
                image_path: obj.image_path ? obj.image_path.split(',') : []
            }));

            res.status(200).json(objetoUsuario);
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ err: "Erro ao processar o request" });
    }
};

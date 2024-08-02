import conn from "../config/conn.js";

const tableUsers = `
    CREATE TABLE IF NOT EXISTS usuarios (
        usuario_id VARCHAR(60) PRIMARY KEY,
        nome VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        telefone VARCHAR(255) NOT NULL,
        senha VARCHAR(255) NOT NULL,
        imagem VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
`;

conn.query(tableUsers, (err) => {
    if (err) {
        console.error(err);
        return;
    }
    console.log("Tabela de [usuarios] criada com sucesso");
});

import conn from "../config/conn.js"

const tableUsers = /*sql*/`
    create table if not exists usuarios(
        usuario_id varchar(60) primary key,
        nome varchar(255) not null,
        email varchar(255) not null,
        telefone varchar(255) not null,
        senha varchar(255) not null,
        imagem varchar(255) not null,

        created_at timestamp default CURRENT_TIMESTAMP,
        updated_at timestamp default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP
    )
`;

conn.query(tableUsers, (err)=>{
    if(err){
        console.error(err)
        return
    }
    console.log("Tabela de [usuarios] criado com sucesso")
})


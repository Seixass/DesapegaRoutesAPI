```markdown
## Instalação

Para configurar o projeto localmente, siga os passos abaixo para instalar as dependências necessárias.

### 1. Instale as Dependências de Produção

As dependências de produção são necessárias para o funcionamento do projeto. Para instalá-las, execute o comando abaixo:

```bash
npm install
```

Isso instalará as seguintes bibliotecas:

- **bcrypt**: Para criptografia de senhas.
- **cookie-parse**: Para análise de cookies HTTP.
- **cors**: Para permitir requisições de diferentes origens (Cross-Origin Resource Sharing).
- **dotenv**: Para gerenciar variáveis de ambiente.
- **express**: Framework web minimalista para Node.js.
- **jsonwebtoken**: Para gerar e validar tokens JWT.
- **multer**: Middleware para upload de arquivos.
- **mysql2**: Cliente MySQL para Node.js, utilizado para se conectar ao banco de dados.
- **uuid**: Para gerar identificadores únicos universais (UUID).

### 2. Instale as Dependências de Desenvolvimento

As dependências de desenvolvimento são necessárias durante o desenvolvimento do projeto. Para instalá-las, execute o seguinte comando:

```bash
npm install --save-dev
```

Isso instalará a seguinte biblioteca:

- **nodemon**: Ferramenta que reinicia automaticamente o servidor Node.js sempre que há mudanças no código.

### 3. Iniciando o Projeto

Após a instalação das dependências, você pode iniciar o servidor de desenvolvimento com o comando:

```bash
npm run dev
```

Esse comando irá iniciar o servidor utilizando o `nodemon`, que monitora alterações nos arquivos e reinicia o servidor automaticamente.
```

Esse texto unifica todas as informações em uma seção, explicando como instalar as dependências de produção e de desenvolvimento, além de como iniciar o projeto.

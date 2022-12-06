# TEMPLATE EDITOR BACK END

Servidor do projeto de criação de documentos.

## Configurações

### Node version
     >= v16.2.0

### VARIÁVEIS DE AMBIENTE
    PORT= *PORTA ONDE A APLICAÇÂO IRÀ RODAR*

    DB_HOST= *Servidor do banco de dados MySQL*
    DB_PORT= *Porta do banco de dados*
    DB_USER= *Usuário do banco de dados*
    DB_NAME= *Nome do banco de dados*
    DB_PASSWORD = *Senha do usuário do banco de dados*

    JWT_SECRET= *Segredo para a criação do JWT*

    ADMIN_INITIAL_PASSWORD = *Senha inicial para o usuário ADMIN (necessário para migrations)*

## Comandos
    npm run start

Inicia a aplicação

    npm run dev

Inicia a aplicação em modo de desenvolvimento

    npm run migrations 

Inicia a criação do banco de dados e do Superusuario ADMIN (com a senha definida em variável de ambiente).

## ENDPOINTS

    POST <BASE URL>/signup
    Body: {
        name, 
        email, 
        registration, 
        departament, 
        password,
        role,
    }
    HEADERS Authorization: token

Criação do usuário. Recebe no body os campos name, email (necessário email da Casal), registration (matrícula do funcionário), departament (setor do funcionário), password (senha) e role (ADMIN OU USER). No Headers da requisiçaõ recebe como Autorization o token do usuário que está criando (ADMIN).

    PUT <BASE URL>/login
    Body: {
        email,
        password
    }

Login do usuário. Retorna o Token de autorização.

    GET <BASE URL>/users
    HEADERS Authorization: token

Lista todos os usuários. No Headers da requisiçaõ recebe como Autorization o token do usuário que está requisitando. Possui filtros de pesquisa por querys page e name.

    GET <BASE URL>/users/:id
    HEADERS Authorization: token

Rertorna o usuário da ID especificada.

    GET <BASE URL>/current
    HEADERS Authorization: token

Retorna o usuário atual (a partir do token)

    GET <BASE URL>/token
    HEADERS Authorization: token

Retorna a validade ou não do token.

    PUT <BASE URL>/users/:id
    Body: {
        name, 
        email, 
        registration, 
        departament, 
        role,
    }
    HEADERS Authorization: token

Atualiza as informações do usuário com os campos passados.

    POST <BASE URL>/files/:model
    Body: {
        campos do modelo
    }
    HEADERS Authorization: token

Cria um arquivo do modelo especificado no path. O body da requisição depende do modelo criado. 

    get <BASE URL>/files/:userId
    HEADERS Authorization: token

Retorna os arquivos criados pelo usuário da ID especificada.

    GET <BASE URL>/download/:id/:token

Faz o download do arquivo da ID especificada no path. O token de autorização do usuário também deve ser passado no path.

    GET <BASE URL>/models/download/:model/:token

Faz o download da planilha de modelo especidicada no path. O token de autorização do usuário também deve ser passado no path.

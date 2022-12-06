import connection from './Connection.js';
import HashManager from './../helpers/HashManager.js';
import IdGenerator from './../helpers/IdGenerator.js';
import dotenv from "dotenv";

dotenv.config()

const adminInitialPasswoard = new HashManager().createHash(process.env.ADMIN_INITIAL_PASSWORD);
const adminId = new IdGenerator().generateId()

const createUsersTable = () => connection
    .raw(`
        CREATE TABLE IF NOT EXISTS users (
            id varchar(255) NOT NULL,
            name varchar(255) NOT NULL,
            email varchar(255) NOT NULL,
            registration varchar(255) NOT NULL,
            departament varchar(255) NOT NULL,
            role enum('USER','ADMIN') DEFAULT 'USER',
            password varchar(255) NOT NULL,
            PRIMARY KEY (id),
            UNIQUE KEY email (email)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `)

const createFilesTable = () => connection
    .raw(`
        CREATE TABLE IF NOT EXISTS files (
            id varchar(255) NOT NULL,
            user_id varchar(255) NOT NULL,
            name varchar(255) DEFAULT NULL,
            departament varchar(255) DEFAULT NULL,
            date datetime DEFAULT current_timestamp(),
            protected tinyint(1) DEFAULT 0,
            PRIMARY KEY (id),
            KEY user_id (user_id),
            CONSTRAINT files_ibfk_1 FOREIGN KEY (user_id) REFERENCES users (id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `)

const createManagementTables = () => connection
    .raw(`
        CREATE TABLE IF NOT EXISTS creation_management (
            id varchar(255) NOT NULL,
            creator_id varchar(255) NOT NULL,
            user_id varchar(255) NOT NULL,
            date datetime DEFAULT current_timestamp(),
            PRIMARY KEY (id),
            KEY creator_id (creator_id),
            KEY user_id (user_id),
            CONSTRAINT creation_management_ibfk_1 FOREIGN KEY (creator_id) REFERENCES users (id),
            CONSTRAINT creation_management_ibfk_2 FOREIGN KEY (user_id) REFERENCES users (id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `)

const createManagementTableII = () => connection
    .raw(`
    CREATE TABLE IF NOT EXISTS update_management (
        id varchar(255) NOT NULL,
        updater_id varchar(255) NOT NULL,
        updated_id varchar(255) NOT NULL,
        name varchar(255) DEFAULT NULL,
        email varchar(255) DEFAULT NULL,
        registration varchar(255) DEFAULT NULL,
        departament varchar(255) DEFAULT NULL,
        role varchar(255) DEFAULT NULL,
        date datetime DEFAULT current_timestamp(),
        PRIMARY KEY (id),
        KEY updater_id (updater_id),
        KEY updated_id (updated_id),
        CONSTRAINT update_management_ibfk_1 FOREIGN KEY (updater_id) REFERENCES users (id),
        CONSTRAINT update_management_ibfk_2 FOREIGN KEY (updated_id) REFERENCES users (id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`)

const populateTable = () => connection('users')
    .insert({
        id: adminId,
        name: 'Usuario Admin',
        email: 'admin@casal.al.gov.br', 
        registration: '0000', 
        departament: 'Gerência da Tecnologia da Informação - GETIN',
        role: 'ADMIN',
        password: adminInitialPasswoard,
    })

createUsersTable()
.then(() => {
    console.log("TABELA DE USUÀRIOS CRIADA")
    createFilesTable()
    .then(() => {
        console.log("TABELA DE ARQUIVOS CRIADA")
        createManagementTables()
        .then(() => {
            console.log("TABELA DE GERENCIAMENTO CRIADA")
            createManagementTableII()
            .then(() => {
                console.log("SEGUNDA TABELA DE GERENCIAMENTO CRIADA")
                populateTable()
                .then(() => {
                    console.log("ADMIN CRIADO")
                })
                .catch(err => console.log("ERRO AO CRIAR ADMIN", err.message || err.sqlmessage))
            })
            .catch(err => console.log("ERRO AO CRIAR TABELA DE GERENCIAMENTO", err.message || err.sqlmessage))
        })
        .catch(err => console.log("ERRO AO CRIAR TABELA DE GERENCIAMENTO", err.message || err.sqlmessage))
    })
    .catch(err => console.log("ERRO AO CRIAR TABELA DE ARQUIVOS", err.message || err.sqlmessage))
})
.catch(err => console.log("ERRO AO CRIAR TABELA DE USUARIOS", err.message || err.sqlmessage))
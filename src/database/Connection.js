import knex from "knex";
import dotenv from 'dotenv';
import path from 'path';
import {fileURLToPath} from 'url';

const __fileName = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__fileName);

dotenv.config({path: path.join(__dirname, "../../dev.env")})

const connection = knex ({
    client: "mysql",
    connection: {
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT || 3312),
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
    },
})

export default connection
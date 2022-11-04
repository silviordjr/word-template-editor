import Docxtemplater from "docxtemplater"
import PizZip from "pizzip"
import IdGenerator from './../helpers/IdGenerator.js';
import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';
import Authenticator from '../helpers/Authenticator.js';

export default class FileServices {
    async create (body, token, model, populate, get){
        if (!token){
            throw new Error ("Usuário não autenticado.")
        }

        const tokenData = new Authenticator().getTokenData(token)

        if (!tokenData){
            throw new Error ("Usuário não autenticado.")
        }

        const __fileName = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__fileName);

        const inputDir = path.resolve(__dirname, `../../inputs/${model}.docx`)

        if (!inputDir){
            throw new Error ("Modelo inválido.")
        }

        const content = await fs.promises.readFile(
            inputDir,
            "binary"
        )

        const zip = new PizZip(content)

        const doc = new Docxtemplater(zip, {
            paragraphLoop: true,
            linebreaks: true

        })

        doc.render(body)

        const buf = doc.getZip().generate({
            type: "nodebuffer",
            compression: "DEFLATE",
        })

        const id = new IdGenerator().generateId()

        const outputDir = path.resolve(__dirname, `../outputs/${id}.docx`)

        await fs.promises.writeFile(
            outputDir, buf
        )

        await populate(id, tokenData.id, body.departament, body.name)

        const file = await get(id)

        return {file}
    }
    
    async download (id, token){
        if (!token){
            throw new Error ("Usuário não autenticado.")
        }

        const tokenData = new Authenticator().getTokenData(token)

        if (!tokenData){
            throw new Error ("Usuário não autenticado.")
        }

        const __fileName = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__fileName);

        const file = path.resolve(__dirname, `../outputs/${id}.docx`).toString()

        if (!file){
            throw new Error ("Arquivo inexistente.")
        }

        return file
    }
}
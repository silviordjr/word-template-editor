import Docxtemplater from "docxtemplater"
import PizZip from "pizzip"
import IdGenerator from './../helpers/IdGenerator.js';
import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';

export default class FileServices {
    async create (body, protocol, host){
        const __fileName = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__fileName);

        const inputDir = path.resolve(__dirname, "../../inputs/tag-example.docx")

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

        const fileLink = `${protocol}://${host}/outputs/${id}.docx`

        return {link: fileLink}
    }
}
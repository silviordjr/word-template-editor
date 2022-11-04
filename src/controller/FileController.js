import FileServices from "../services/FileServices.js"
import FileDatabase from './../database/FileDatabase.js';

export default class FileController {
    async create (req, res) {
        try {
            const body = req.body
            const token = req.headers.authorization
            const model = req.params.model

            const doc = await new FileServices().create(body, token, model, new FileDatabase().create, new FileDatabase().getById)

            res.status(200).send(doc)
        } catch (error) {
            res.status(500).send(error.message)
        }
    }

    async download (req, res) {
        try {
            const token = req.headers.authorization || ''
            const id = req.params.id
            const pathUrl = req.path
            const file = await new FileServices().download(id, token)

            if (pathUrl !== "/"){
                res.download(file, (err) => {
                    if (err){
                        console.log (err)
                    }
                })
            } else {
                res.status(200).send("ok")
            }
            
        } catch (error) {
            res.status(500).send(error.message)
        }
    }
}
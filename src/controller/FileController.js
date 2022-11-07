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
            res.status(400).send({message: error.message})
        }
    }

    async download (req, res) {
        try {
            const token = req.headers.authorization || ''
            const id = req.params.id
            const pathUrl = req.path
            const file = await new FileServices().download(id, token, new FileDatabase().getById)

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
            res.status(400).send({message: error.message})
        }
    }

    async getByUser (req, res) {
        try {
            const token = req.headers.authorization || ''
            const userId = req.params.userId
            const page = req.query.page || 1

            const files = await new FileServices().getByUserId(token, userId, page, new FileDatabase().getByUserId)

            res.status(200).send({files})
        } catch (error) {
            res.status(400).send({message: error.message})
        }
    }
}
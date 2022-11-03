import FileServices from "../services/FileServices.js"

export default class FileController {
    async create (req, res) {
        try {
            const body = req.body
            const protocol = req.protocol
            const host = req.get('host')

            const doc = await new FileServices().create(body, protocol, host)

            res.status(200).send(doc)
        } catch (error) {
            res.status(500).send(error.message)
        }
    }
}
import UserServices from "../services/UserServices.js"
import UserDatabase from './../database/UserDatabase.js';

export default class UserController {
    async create (req, res) {
        try {
            const {name, email, registration, departament, password, role} = req.body

            const token = await new UserServices().create(name, email, registration, departament, password, new UserDatabase().checkByEmail, new UserDatabase().create, role)

            res.status(200).send(token)
        } catch (error) {
            res.status(500).send(error.message || error.sqlmessage)
        }
    }

    async login (req, res) {
        try {
            const {email, password} = req.body

            const token = await new UserServices().login(email, password, new UserDatabase().getByEmail)

            res.status(200).send(token)
        } catch (error) {
            res.status(500).send(error.message || error.sqlmessage)
        }

    }

    async getAll (req, res) {
        try {
            const token = req.headers.authorization
            const page = req.query.page || 1
            const name = req.query.name || ""

            const users = await new UserServices().getAll(token, page, name, new UserDatabase().getAll)

            res.status(200).send(users)
            
        } catch (error) {
            res.status(500).send(error.message || error.sqlmessage)
        }

    }

    async getById (req, res) {

    }

    async update (req, res) {

    }

    async delete(req, res) {

    }
}
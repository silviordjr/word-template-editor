import UserServices from "../services/UserServices.js"
import UserDatabase from './../database/UserDatabase.js';

export default class UserController {
    async create (req, res) {
        try {
            const {name, email, registration, departament, password, role} = req.body
            const token = req.headers.authorization

            const response = await new UserServices().create(name, email, registration, departament, password, new UserDatabase().checkByEmail, new UserDatabase().create, role, token)

            res.status(200).send(response)
        } catch (error) {
            res.status(400).send({mesage: error.message || error.sqlmessage})
        }
    }

    async login (req, res) {
        try {
            const {email, password} = req.body

            const token = await new UserServices().login(email, password, new UserDatabase().getByEmail)

            res.status(200).send(token)
        } catch (error) {
            res.status(400).send({mesage: error.message || error.sqlmessage})
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
            res.status(400).send({mesage: error.message || error.sqlmessage})
        }

    }

    async getById (req, res) {
        try {
            const token = req.headers.authorization
            const id = req.params.id

            const user = await new UserServices().getById(token, id, new UserDatabase().getById)

            res.status(200).send(user)
            
        } catch (error) {
            res.status(400).send({mesage: error.message || error.sqlmessage})
        }
    }

    async getCurrent (req, res) {
        try {
            const token = req.headers.authorization

            const user = await new UserServices().getCurrent(token, new UserDatabase().getById)

            res.status(200).send(user)
        } catch (error) {
            res.status(400).send({mesage: error.message || error.sqlmessage})
        }
    }

    async validateToken (req,res) {
        try {
            const token = req.headers.authorization

            const userInfo = new UserServices().validateToken(token)
            
            res.status(200).send(userInfo)
        } catch (error) {
            res.status(400).send({
                validToken: false, 
                message: error.message || error.sqlmessage
            })
        }
    }

    async update (req, res) {
        try {
            const token = req.headers.authorization
            const userId = req.params.id
            const {name, email, registration, departament, role} = req.body

            await new UserServices().update(name, email, registration, departament, role, token, userId, new UserDatabase().getById, new UserDatabase().checkByEmail, new UserDatabase().update)
            
            res.status(200).send({message: 'Usuário atualizado. '})
        } catch (error) {
            res.status(400).send({mesage: error.message || error.sqlmessage})
        }
    }

    async delete(req, res) {

    }
}
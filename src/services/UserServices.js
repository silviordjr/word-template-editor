import Authenticator from '../helpers/Authenticator.js';
import HashManager from '../helpers/HashManager.js';
import IdGenerator from './../helpers/IdGenerator.js';

export default class UserServices {
    async create (name, email, registration, departament, password, checkUser, populate, role, auth) {
        if (!auth){
            throw new Error ("Usuário não autenticado.")
        }

        const tokenData = new Authenticator().getTokenData(auth)

        if (!tokenData){
            throw new Error ("Usuário não autenticado.")
        }

        if (tokenData.role !== 'ADMIN'){
            throw new Error ("Usuário não autorizado.")
        }

        if (!name || !email || !registration || !departament || !password){
            throw new Error ("Campos incompletos.")
        }

        const emailArr = email.split('@')

        if (!emailArr[1]){
            throw new Error ("Campo email inválido.")
        }

        if (emailArr[1] !== 'casal.al.gov.br'){
            throw new Error ("Campo email inválido.")
        }

        const usedEmail = await checkUser(email)

        if (usedEmail){
            throw new Error ("Campo email inválido.")
        }

        const id = new IdGenerator().generateId()

        const hashPassword = new HashManager().createHash(password)

        if (!role){
            role === "USER"
        }

        await populate(id, name, email, registration, departament, hashPassword, role)

        const token = new Authenticator().generateToken({id: id, role: role})

        return {token}
    }

    async login(email, password, getUser) {
        if (!email, !password){
            throw new Error ("Campos incompletos.")
        }

        const user = await getUser(email)

        if (!user){
            throw new Error("Email ou senha incorretos.")
        }

        const passwordIsCorrect = new HashManager().compareHash(password, user.password)

        if (!passwordIsCorrect){
            throw new Error("Email ou senha incorretos.")
        }

        const token = new Authenticator().generateToken({id: user.id, role:user.role})

        return {token}
    }

    async getAll (token, page, name, getUsers) {
        if (!token){
            throw new Error ("Usuário não autenticado.")
        }

        const tokenData = new Authenticator().getTokenData(token)

        if (!tokenData){
            throw new Error ("Usuário não autenticado.")
        }

        const users = await getUsers(page, name)

        return users
    }

    async getById (token, id, get){
        if (!token){
            throw new Error ("Usuário não autenticado.")
        }

        const tokenData = new Authenticator().getTokenData(token)

        if (!tokenData){
            throw new Error ("Usuário não autenticado.")
        }

        const user = await get (id)

        return user
    }

    async getCurrent (token, get){
        if (!token){
            throw new Error ("Usuário não autenticado.")
        }

        const tokenData = new Authenticator().getTokenData(token)

        if (!tokenData){
            throw new Error ("Usuário não autenticado.")
        }

        const user = await get (tokenData.id)

        return user
    }

    validateToken (token) {
        if (!token){
            throw new Error ("Usuário não autenticado.")
        }

        const tokenData = new Authenticator().getTokenData(token)

        let userInfo

        if (!tokenData){
            userInfo = {
                validToken: false,
                message: 'Token Inválido.'
            }
        } else {
            userInfo = {
                validToken: true,
                role: tokenData.role
            }
        }

        return userInfo
    }

    async update (name, email, registration, departament, role, token, userId, getByID, checkByEmail, updateUser, saveUpdate) {
        if (!token){
            throw new Error ("Usuário não autenticado.")
        }

        const tokenData = new Authenticator().getTokenData(token)

        if (!tokenData){
            throw new Error ("Usuário não autenticado.")
        }

        if (role === 'ADMIN' && tokenData.role !== 'ADMIN'){
            throw new Error ("Sem permissão para a operação.")
        }

        if (userId !== tokenData.id && tokenData.role !== 'ADMIN'){
            throw new Error ("Sem permissão para a operação.")
        }

        const emailArr = email.split('@')

        if (!emailArr[1]){
            throw new Error ("Campo email inválido.")
        }

        if (emailArr[1] !== 'casal.al.gov.br'){
            throw new Error ("Campo email inválido.")
        }

        const user = await getByID(userId)

        const usedEmail = await checkByEmail(email)

        if (usedEmail && user.email !== email) {
            throw new Error ("Email cadastrado a outro usuário.")
        }

        const updateInfos = {
            name: user.name === name ? '' : name,
            email: user.email === email ? '' : email,
            registration: user.registration === registration ? '' : registration,
            role: user.role === role ? '' : role,
            departament: user.departament === departament ? '' : departament
        }

        await updateUser(name, email, registration, departament, role, userId)

        const id = new IdGenerator().generateId()

        await saveUpdate(id, tokenData.id, userId, updateInfos)
    }
}
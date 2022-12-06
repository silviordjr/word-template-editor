import connection from './Connection.js';

export default class UserDatabase {
    async create (id, name, email, registration, departament, password, role) {
        await connection('users')
        .insert({
            id,
            name,
            email, 
            registration, 
            departament,
            role,
            password,
        })
    }

    async checkByEmail (email) {
        const user = await connection('users')
        .where({email})
        .select('*')

        if (user.length > 0){
            return true
        } else {
            return false
        }
    }

    async getByEmail (email) {
        const user = await connection('users')
        .where({email})
        .select('*')

        if (user){
            return user[0]
        }
        else return null
    }

    async getAll (page, name){
        const users = await connection('users')
        .select('id', 'name', 'email', 'registration', 'departament')
        .where('name', 'like', `%${name}%`)
        .limit(9)
        .offset((page - 1)*9)

        const count = await connection ('users')
        .count('id')

        return {users, count}
    } 

    async getById (id){
        const user = await connection ('users')
        .select('id', 'name', 'email', 'registration', 'departament', 'role')
        .where({id})

        return user[0]
    }

    async update (name, email, registration, departament, role, userId) {
        await connection ('users')
        .where({id: userId})
        .update({
            name,
            email,
            registration,
            departament,
            role
        })
    }

    async saveUpdate (id, updaterID, updatedID, infos) {
        await connection ('update_management')
        .insert({
            id,
            updater_id: updaterID,
            updated_id: updatedID,
            name: infos.name,
            email: infos.email,
            registration: infos.registration,
            departament: infos.departament,
            role: infos.role
        })
    }
}
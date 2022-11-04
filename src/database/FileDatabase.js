import connection from "./Connection.js";

export default class FileDatabase {
    async create (id, user_id, departament, name){
        await connection ('files')
        .insert({
            id,
            name,
            departament,
            user_id
        })
    }

    async getById (id) {
        const file = await connection ('files')
        .where({id})
        .select('*')

        return file[0]
    }
}
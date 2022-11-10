import connection from "./Connection.js";

export default class FileDatabase {
    async create (id, user_id, departament, name, isProtected){
        await connection ('files')
        .insert({
            id,
            name,
            departament,
            user_id,
            protected: isProtected
        })
    }

    async getById (id) {
        const file = await connection ('files')
        .where({id})
        .select('*')

        return file[0]
    }

    async getByUserId (userId, page, owner) {
        let files  
        let count
        
        if (owner){
            files = await connection ('files')
            .where({user_id: userId})
            .select('id', 'name')
            .orderBy('date', 'desc')
            .limit(10)
            .offset(10*(page - 1))

            count = await connection ('files')
            .where({user_id: userId})
            .count('id')
        } else {
            files = await connection ('files')
            .where({user_id: userId})
            .andWhere({protected: false})
            .select('id', 'name')
            .orderBy('date', 'desc')
            .limit(10)
            .offset(10*(page - 1))

            count = await connection ('files')
            .where({user_id: userId})
            .andWhere({protected: false})
            .count('id')
        }
    
        return {files, count}
    }
}
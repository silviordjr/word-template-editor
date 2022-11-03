import pkg from "bcryptjs"

const { compareSync, genSaltSync, hashSync } = pkg

export default class HashManager {
    createHash = (plainText) => {
        const cost = 12
        const salt = genSaltSync(cost)
        const cypherText = hashSync(plainText, salt)

        return cypherText
    }

    compareHash = (plainText, cypherText) => {
        return compareSync(plainText, cypherText)
    }
}
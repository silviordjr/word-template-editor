import pkg from "jsonwebtoken"
import dotenv from 'dotenv'

dotenv.config()
const {sign, verify } = pkg

export default class Authenticator {
    generateToken = (payload) => {
        const token = sign(
            payload,
            process.env.JWT_SECRET,
            {expiresIn: process.env.JWT_EXPIRES || 7*24*60*60}
        )

        return token
    }

    getTokenData = (token) => {
        try {
            const tokenData = verify(
                token,
                process.env.JWT_SECRET
            )

            return {
                id: tokenData.id,
                role: tokenData.role
            }
        } catch (error) {
            console.log(error)
            return null
        }
    }
}
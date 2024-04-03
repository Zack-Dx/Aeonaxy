import bcrypt from 'bcrypt'

export const hashPassword = async (password) => {
    const saltRounds = 10

    try {
        const hashedPassword = await bcrypt.hash(password, saltRounds)
        return hashedPassword
    } catch (error) {
        console.log('Failed to hash the password')
        throw error
    }
}

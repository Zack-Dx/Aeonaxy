import bcrypt from 'bcrypt';

export const hashPassword = async (password) => {
    const saltRounds = 10;
    try {
        return await bcrypt.hash(password, saltRounds);
    } catch (error) {
        console.log(error.message);
        throw error;
    }
};

export const comparePassword = async (inputPassword, hashedPassword) => {
    try {
        return await bcrypt.compare(inputPassword, hashedPassword);
    } catch (error) {
        console.log(error.message);
        throw error;
    }
};

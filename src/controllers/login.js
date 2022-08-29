const { User } = require('../database/models');
const token = require('../token/tokenGenerate');

const userValidation = async (email, password) => {
    const user = await User.findOne({
        where: { email },
           });

    if (!email || !password) {
        return { code: 400, message: 'Some required fields are missing' }; 
} 
    if (!user) {
        return { code: 400, message: 'Invalid fields' };
    }
    const tokenGenerate = token.createToken(email);

    return tokenGenerate;
};

const userLogin = async (req, res) => {
   try {
    const { email, password } = req.body;
    
    const validUser = await userValidation(email, password);
    if (validUser.code === 400) {
        return res.status(validUser.code).json({ message: validUser.message }); 
    }
    return res.status(200).json({ token: validUser });    
} catch (error) {
    return res.status(500).json({ message: 'error' });
   }
};

module.exports = {
    userLogin,
};
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const { User } = require('../database/models');
const token = require('../token/tokenGenerate');

const userVerify = Joi.object({
    displayName: Joi.string().min(8).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    image: Joi.string().required(),
  });

const createUser = async (req, res) => {
    const { displayName, email, password, image } = req.body;
    const { error } = userVerify.validate({ displayName, email, password, image });
      if (error) {
        return res.status(400).json({ message: error.message });
      }
    const user = await User.findOne({ where: { email } });
      if (user) {
        return res.status(409).json({ message: 'User already registered' });
      }
     if (!user) {
        await User.create({ displayName, email, password, image });
        const Newtoken = token.createToken({ email });
        return res.status(201).json({ token: Newtoken });
      }
    };

const getAllUsers = async (req, res) => {
    const usersList = await User.findAll({
        attributes: { exclude: ['password'] },
      });

    return res.status(200).json(usersList);
};

const userById = async (req, res) => {
    const { id } = req.params;
    const userId = await User.findByPk(id, {
    attributes: { exclude: ['password'] },
  });
    if (!userId) { return res.status(404).json({ message: 'User does not exist' }); }
    return res.status(200).json(userId);
};

async function verifyUser(req) {
  const { authorization } = req.headers; 
  const decoded = jwt.decode(authorization);
    
 const findId = await User.findOne({ where: { email: decoded.data } });
 return findId.id;
}

const deleteMe = async (req, res) => {
    const findMyId = await verifyUser(req);
    await User.destroy({ where: { id: findMyId } });
    return res.status(204).end();
};
module.exports = {
    createUser,
    getAllUsers,
    userById,
    deleteMe,
};

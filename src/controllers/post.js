const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const { BlogPost, Category, User, PostCategory } = require('../database/models');

const verifyCategory = async (c) => {
    const findCategories = await Category.findAll({
        where: { id: c },
    });
    return findCategories;
};

const formatted = (object) => ({
    id: object.id,
    title: object.title,
    content: object.content,
    userId: object.userId,
    updated: object.updatedAt,
    published: object.createdAt,
  });

async function verifyUser(req) {
    const { authorization } = req.headers; 
    const decoded = jwt.decode(authorization);
      
   const findId = await User.findOne({ where: { email: decoded.data } });
   return findId.id;
 }
  
const newPost = async (req, res) => {
    const { title, content, categoryIds } = req.body;
    if (!title || !content || !categoryIds) {
        return res.status(400).json({ message: 'Some required fields are missing' });
    }
    const verify = await verifyCategory(categoryIds);
    if (verify.length === 0) {
        return res.status(400).json({ message: '"categoryIds" not found' });
    }
    const findMail = await verifyUser(req);
    
    const createPost = await BlogPost.create({
            title, content, categoryIds, userId: findMail,
    });
    const toFormat = formatted(createPost);

     await categoryIds.map((a) => PostCategory.create({ postId: toFormat.id, categoryId: a }));

    return res.status(201).json(toFormat);
};

const getById = async (req, res) => {
    const { id } = req.params;
    const posyToFind = await BlogPost.findOne({
        where: { id },
        include: [
          { model: User, as: 'user', attributes: { exclude: ['password'] } },
          { model: Category, as: 'categories', attributes: ['id', 'name'] },
        ],
      });
      if (!posyToFind) {
        return res.status(404).json({ message: 'Post does not exist' });
      }

      return res.status(200).json(posyToFind);
};

const getAll = async (req, res) => {
    const list = await BlogPost.findAll({
        include: [
        { model: User, as: 'user', attributes: { exclude: ['password'] } },
        { model: Category, as: 'categories', attributes: ['id', 'name'] },
      ],
      });
      return res.status(200).json(list);
};
const formatEditPost = async (id) => {
    const result = await BlogPost.findOne({
        where: { id },
        include: [
          { model: User, as: 'user', attributes: { exclude: ['password'] } },
          { model: Category, as: 'categories', attributes: ['id', 'name'] },
        ],
      });
      return result;
    };

const editPost = async (req, res) => {
    const { id } = req.params;
    const { title, content } = req.body;
    const toVerify = await verifyUser(req);

    const findByUser = await BlogPost.findAll({
        where: { id, userId: toVerify },
    });
    
    if (findByUser.length === 0) {
        return res.status(401).json({ message: 'Unauthorized user' });
    }
    if (!title || !content) {
        return res.status(400).json({ message: 'Some required fields are missing' });
    }
    await BlogPost.update(
        { title, content },
        { where: { id } },
    );
    const result = await formatEditPost(id);
    return res.status(200).json(result);
};

const deletePost = async (req, res) => {
    const { id } = req.params;
    const toVerify = await verifyUser(req);

    const findByUser = await BlogPost.findAll({
        where: { id, userId: toVerify },
    });

    const postExist = await BlogPost.findOne({ where: { id } });
    
    if (!postExist) {
        return res.status(404).json({ message: 'Post does not exist' });
    }    

    if (findByUser.length === 0) {
        return res.status(401).json({ message: 'Unauthorized user' });
    }
     await BlogPost.destroy({ where: { id } });

     return res.status(204).end();
};

const search = async (req, res) => {
    const { q } = req.query;
    const result = await BlogPost.findAll({
        where: {
          [Op.or]: [
            { title: { [Op.like]: `%${q}%` } },
            { content: { [Op.like]: `%${q}%` } },
          ],
        },
        include: [
          { model: User, as: 'user', attributes: { exclude: 'password' } },
          { model: Category, as: 'categories' },
        ],
      });
      return res.status(200).json(result);
};
module.exports = {
    newPost,
    getById,
    getAll,
    editPost,
    deletePost,
    search,
};

const { Category } = require('../database/models');

const createCategory = async (req, res) => {
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ message: '"name" is required' });
    }
    const newCategory = await Category.create({ name });

    return res.status(201).json(newCategory);
};

const getAll = async (_req, res) => {
    const allCategories = await Category.findAll();
    return res.status(200).json(allCategories);
};

module.exports = {
    createCategory,
    getAll,
};
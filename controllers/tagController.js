/**
 * Controller for Tag APIs
 * @module controllers/tagController
 */
const Tag = require('../models/Tag');

/**
 * Get all tags
 * @param {Request} req
 * @param {Response} res
 */
exports.getTags = async (req, res) => {
  try {
    const tags = await Tag.find();
    res.json(tags);
  } catch (err) {
    res.status(500).json({ error: 'SERVER_ERROR', message: err.message });
  }
};

/**
 * Create a new tag
 * @param {Request} req
 * @param {Response} res
 */
exports.createTag = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'BAD_REQUEST', message: 'name is required' });
    }
    let tag = await Tag.findOne({ name });
    if (tag) {
      return res.status(409).json({ error: 'CONFLICT', message: 'Tag already exists' });
    }
    tag = await Tag.create({ name });
    res.status(201).json(tag);
  } catch (err) {
    res.status(500).json({ error: 'SERVER_ERROR', message: err.message });
  }
}; 
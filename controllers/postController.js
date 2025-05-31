/**
 * Controller for Post APIs
 * @module controllers/postController
 */

// I am using Joi for validation, we can use express-validator or other validation libraries as well
const Joi = require('joi');
const Post = require('../models/Post');
const Tag = require('../models/Tag');

// Created validation schemas for get posts
const getPostsQuerySchema = Joi.object({
  sort: Joi.string().optional(),
  page: Joi.number().integer().min(1).optional().default(1),
  limit: Joi.number().integer().min(1).optional().default(10),
  keyword: Joi.string().optional(),
  tag: Joi.string().optional(),
}).unknown(false); // Disallow unknown query params

// Created validation schemas for create post
const createPostBodySchema = Joi.object({
  title: Joi.string().required(),
  desc: Joi.string().required(),
  image: Joi.string().required(), // base64 string
  tags: Joi.array().items(Joi.string()).optional(),
});

/**
 * Get all posts with filtering, sorting, pagination, and tag/keyword search.
 * Allowed query params: sort, page, limit, keyword, tag
 * @param {Request} req
 * @param {Response} res
 */
exports.getPosts = async (req, res) => {
  // Validate query params
  const { error, value: query } = getPostsQuerySchema.validate(req.query);
  if (error) {
    return res.status(400).json({ error: 'BAD_REQUEST', message: error.details[0].message });
  }
  // Extracting the data from request query
  const { sort = '-createdAt', page, limit, keyword, tag } = query;
  const filter = {};
 // Performing search on title and desc based on keyword
  if (keyword) {
    filter.$or = [
      { title: { $regex: keyword, $options: 'i' } },
      { desc: { $regex: keyword, $options: 'i' } },
    ];
  }

  // Performing search on tag based on tag name
  if (tag) {
    // Performing search on tags based on tag name, Currently we are using for single tag search,
    // we can use for multiple tags search by using $in operator
    const tagDoc = await Tag.findOne({ name: tag });
    if (tagDoc) {
      // Performing search on tags based on tag name
      filter.tags = tagDoc._id;
    } else {
      filter.tags = null; // No posts will match
    }
  }
  // Performing pagination and sorting
  try {
    // Performing pagination and sorting
    const posts = await Post.find(filter)
      .populate('tags')
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit);
    // Getting the total number of posts
    const total = await Post.countDocuments(filter);
    res.json({ total, page, limit, posts });
  } catch (err) {
    res.status(500).json({ error: 'SERVER_ERROR', message: err.message });
  }
};

/**
 * Create a new post
 * @param {Request} req
 * @param {Response} res
 */
exports.createPost = async (req, res) => {
  // Validate request body
  const { error, value: body } = createPostBodySchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: 'BAD_REQUEST', message: error.details[0].message });
  }
  // Extracting the data from request body, I am directly taking base64 string for image for now, 
  // we can store image in cloudinary or s3 bucket in production to avoid large size of image in database
  // Or We can use multer for image upload then convert it to base64 string
  const { title, desc, image, tags } = body;
  // Performing search on tags based on tag name
  try {
    let tagIds = [];
    if (tags && Array.isArray(tags)) {
      // Performing search on tags based on tag name
      tagIds = await Promise.all(tags.map(async (tagName) => {
        // Performing search on tags based on tag name
        let tag = await Tag.findOne({ name: tagName });
        if (!tag) {
          // Creating a new tag if it doesn't exist
          tag = await Tag.create({ name: tagName });
        }
        return tag._id;
      }));
    }
    const post = await Post.create({ title, desc, image, tags: tagIds });
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ error: 'SERVER_ERROR', message: err.message });
  }
}; 
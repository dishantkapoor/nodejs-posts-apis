const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');

// GET /posts - list posts with filters, sorting, pagination
router.get('/', postController.getPosts);

// POST /posts - create a new post
router.post('/', postController.createPost);

module.exports = router; 
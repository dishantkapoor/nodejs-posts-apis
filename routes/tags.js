const express = require('express');
const router = express.Router();
const tagController = require('../controllers/tagController');

// GET /tags - list all tags
router.get('/', tagController.getTags);

// POST /tags - create a new tag
router.post('/', tagController.createTag);

module.exports = router; 
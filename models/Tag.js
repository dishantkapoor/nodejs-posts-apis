const mongoose = require('mongoose');
// Created Tag Schema
const TagSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
});

module.exports = mongoose.model('Tag', TagSchema); 
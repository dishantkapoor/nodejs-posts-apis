const mongoose = require('mongoose');
// I am using base64 string for image for now, we can store image in cloudinary or s3 bucket in production to avoid large size of image in database
// For tags I am using mongoose.Schema.Types.ObjectId to refer to the Tag model
const PostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  desc: { type: String, required: true },
  image: { type: String, required: true }, // base64 string
  tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }],
}, { timestamps: true });

module.exports = mongoose.model('Post', PostSchema); 
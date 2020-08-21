const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  name: { type: String, required: true },
  url: { type: String, required: true, unique: true },
  photo: { type: String, required: true },
  content: { type: String, required: true } 
}, {
  timestamps: true,
});

mongoose.model('Post', PostSchema);

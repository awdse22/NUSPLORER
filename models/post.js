const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const postSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createTime: {
    type: Date,
    default: Date.now,
  },
  modifier: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  modifyTime: {
    type: Date,
  },
});

const Post = model('Post', postSchema);

module.exports = Post;

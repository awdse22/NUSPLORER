const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const voteSchema = new Schema({
  postId: {
    type: Schema.Types.ObjectId,
    ref: 'Post',
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  value: {
    type: Number,
    enum: [ 1, -1 ], // 1 for upvote, -1 for downvote
    required: true,
  }
});

const Vote = model('Vote', voteSchema);

module.exports = Vote;

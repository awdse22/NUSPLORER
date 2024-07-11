const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const bookmarkSchema = new Schema({
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  modifier: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  roomId: {
    type: Schema.Types.ObjectId,
    ref: 'Room',
    required: true,
  },
  createTime: {
    type: Date,
    default: Date.now,
  },
  modifyTime: {
    type: Date,
  },
});

const Bookmark = model('Bookmark', bookmarkSchema);

module.exports = Bookmark;

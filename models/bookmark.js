const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const bookmarkSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  room: {
    type: Schema.Types.ObjectId,
    ref: 'Room',
    required: true,
  },
});

const Bookmark = model('Bookmark', bookmarkSchema);

module.exports = Bookmark;

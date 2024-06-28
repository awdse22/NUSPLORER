const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const photoSchema = new Schema({
  roomId: {
    type: Schema.Types.ObjectId,
    ref: 'Room',
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  dataType: {
    type: String,
    required: true,
  },
  imageId: {
    type: Schema.Types.ObjectId,
    ref: 'Image',
    unique: true,
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
});

const Photo = model('Photo', photoSchema);

module.exports = Photo;

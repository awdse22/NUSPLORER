const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const imageMetadataSchema = new Schema({
  roomId: {
    type: Schema.Types.ObjectId,
    ref: 'Room',
    required: true,
  },
  description: {
    type: String,
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
  upvoteCount: {
    type: Number,
    default: 0
  },
  downvoteCount: {
    type: Number,
    default: 0
  }
});

const ImageMetadata = model('ImageMetadata', imageMetadataSchema);

module.exports = ImageMetadata;

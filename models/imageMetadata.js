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

imageMetadataSchema.statics.deleteByImageMetadataId = async function(imageMetadataId, session) {
  try {
    const imageMetadata = await this.findById(imageMetadataId).session(session);
    if (imageMetadata) {
      await mongoose.model('Image').findByIdAndDelete(imageMetadata.imageId).session(session);
      await mongoose.model('Report').deleteMany({ contentId: imageMetadataId }).session(session);
      await mongoose.model('Vote').deleteMany({ postId: imageMetadataId }).session(session);
      await this.findByIdAndDelete(imageMetadata._id).session(session);
    }
  } catch (error) {
    throw new Error('Error deleting ImageMetadata: ' + error.message);
  }
}

imageMetadataSchema.statics.deleteByRoomId = async function(roomId, session) {
  try {
    const imageMetadatas = await this.find({ roomId: roomId }).session(session);
    const imageMetadataIds = imageMetadatas.map(data => data._id);
    const imageIds = imageMetadatas.map(data => data.imageId);

    await mongoose.model('Image').deleteMany({ _id: { $in: imageIds } }).session(session);
    await mongoose.model('Report').deleteMany({ contentId: { $in: imageMetadataIds } }).session(session);
    await mongoose.model('Vote').deleteMany({ postId: { $in: imageMetadataIds } }).session(session);
    await this.deleteMany({ roomId: roomId }).session(session);
  } catch (error) {
    throw new Error('Error deleting ImageMetadata for room: ' + error.message);
  }
}

const ImageMetadata = model('ImageMetadata', imageMetadataSchema);

module.exports = ImageMetadata;

const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const roomSchema = new Schema({
  roomCode: {
    type: String,
    required: true,
    unique: true,
    minLength: 3,
  },
  roomName: {
    type: String,
    required: true,
    minLength: 3,
  },
  buildingName: {
    type: String,
    required: true,
    minLength: 3,
  },
  floorNumber: {
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
  modifyTime: {
    type: Date,
  },
});

roomSchema.statics.deleteRoomWithData = async function(roomId, session) {
  let room;
  try {
    room = await this.find({ _id: roomId }).session(session);
  } catch (error) {
    throw new Error('Error finding room: ' + error.message);
  }

  if (room) {
    await mongoose.model('ImageMetadata').deleteByRoomId(roomId, session);
    await mongoose.model('Post').deleteByRoomId(roomId, session);
    await mongoose.model('Report').deleteMany({ contentId: roomId }).session(session);
    await mongoose.model('Bookmark').deleteMany({ room: roomId }).session(session);
    try {
      await this.findByIdAndDelete(roomId).session(session);
    } catch (error) {
      throw new Error('Error deleting room: ' + error.message);
    }
  }
}

const Room = model('Room', roomSchema);

module.exports = Room;

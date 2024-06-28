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
    type: Number,
    required: true,
    min: 1,
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
    required: true,
  },
  modifyTime: {
    type: Date,
  },
});

const Room = model('Room', roomSchema);

module.exports = Room;

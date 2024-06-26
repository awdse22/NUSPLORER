const mongoose = require("mongoose");

const Schema = mongoose.Schema;

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
    unique: true,
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
  creator: String,
  createTime: Date,
  modifier: String,
  modifyTime: Date,
});

module.exports = mongoose.model("Room", roomSchema);

const express = require("express");
const router = express.Router();
const authenticateToken = require("../tokenAuthMiddleware");
const Room = require("../models/room");

router.post("/createRoom", authenticateToken, async (req, res) => {
  const { roomCode, roomName, buildingName, floorNumber } = req.body;
  const { userId } = req.user;

  try {
    const newRoom = await Room.create({
      roomCode,
      roomName,
      buildingName,
      floorNumber,
      creator: userId,
      modifier: userId,
      createTime: new Date(),
      modifyTime: new Date(),
    });
    res.status(201).json(newRoom);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/updateRoom", authenticateToken, async (req, res) => {
  const { _id, roomCode, roomName, buildingName, floorNumber } = req.body;
  const { userId } = req.user;

  Room.findOneAndUpdate(
    { _id: mongoose.Types.ObjectId(_id) },
    {
      roomCode,
      roomName,
      buildingName,
      floorNumber,
      modifier: userId,
      modifyTime: new Date(),
    },
    { new: true }
  )
    .then((room) => {
      if (!room) {
        return res.status(404).json({ error: "Room not found" });
      }
      res.status(200).json(room);
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});

router.post("/getRooms", authenticateToken, async (req, res) => {
  const page = Number.parseInt(req.body.page) || 1;
  const pageSize = Number.parseInt(req.body.pageSize) || 10;

  const { roomCode, roomName } = req.body;

  const searchQuery = {
    $and: [
      roomCode ? { roomCode: { $regex: new RegExp(roomCode, "i") } } : {},
      roomName ? { roomName: { $regex: new RegExp(roomName, "i") } } : {},
    ],
  };

  try {
    const totalRooms = await Room.countDocuments(searchQuery);
    const rooms = await Room.find(searchQuery)
      .skip((page - 1) * pageSize)
      .limit(pageSize);

    const totalPages = Math.ceil(totalRooms / pageSize);

    res.status(200).json({ rooms, totalPages, currentPage: page });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

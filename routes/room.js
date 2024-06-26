const express = require("express");
const router = express.Router();
const authenticateToken = require("../tokenAuthMiddleware");
const Room = require("../models/room");

router.post("/createRoom", authenticateToken, async (req, res) => {
  const { roomCode, buildingName, floorNumber } = req.body;
  const { username } = req.user;

  try {
    const newRoom = await Room.create({
      roomCode,
      buildingName,
      floorNumber,
      creator: username,
      modifier: username,
      createTime: new Date(),
      modifyTime: new Date(),
    });
    res.status(201).json(newRoom);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/updateRoom", authenticateToken, async (req, res) => {
  const { _id, roomCode, buildingName, floorNumber } = req.body;
  const { username } = req.user;

  Room.findOneAndUpdate(
    { _id: mongoose.Types.ObjectId(_id) },
    {
      roomCode,
      buildingName,
      floorNumber,
      modifier: username,
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
  const searchQuery = req.body.roomCode
    ? { roomCode: { $regex: new RegExp(req.body.roomCode, "i") } }
    : {};

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

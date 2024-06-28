const express = require('express');
const router = express.Router();
const authenticateToken = require('../tokenAuthMiddleware');
const Room = require('../models/room');
const postRouter = require('./post');
const photoRouter = require('./photo');

router.use('/:roomId/posts', (req, res, next) => {
  req.roomId = req.params.roomId;
  next();
}, postRouter);
router.use('/:roomId/photos', (req, res, next) => {
  req.roomId = req.params.roomId;
  next();
}, photoRouter);

router.post('/', authenticateToken, async (req, res) => {
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
  } catch (error) {
    if (error.code == 11000) {
      return res.status(400).json({ error: 'A room with this room code already exists'})
    }
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { roomCode, roomName, buildingName, floorNumber } = req.body;
  const { userId } = req.user;

  try {
    const room = await Room.findOneAndUpdate(
      { _id: id },
      {
        roomCode,
        roomName,
        buildingName,
        floorNumber,
        modifier: userId,
        modifyTime: new Date(),
      },
      { new: true },
    );

    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    res.status(200).json(room);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/', async (req, res) => {
  const { page, pageSize, keyword } = req.query;

  const pageNumber = Number.parseInt(page) || 1;
  const limitNumber = Number.parseInt(pageSize) || 10;

  const searchQuery = {
    $or: [
      { roomCode: { $regex: keyword || '', $options: 'i' } },
      { roomName: { $regex: keyword || '', $options: 'i' } },
    ],
  };

  try {
    const total = await Room.countDocuments(searchQuery);
    const list = await Room.find(searchQuery)
      .populate('creator', 'username')
      .populate('modifier', 'username')
      .sort({ roomCode: 1 })
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber);

    res.status(200).json({ total, list });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { userId } = req.user;

  try {
    const room = await Room.findOneAndDelete({ _id: id, creator: userId });
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }
    res.status(200).json(room);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

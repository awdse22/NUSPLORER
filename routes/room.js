const express = require('express');
const router = express.Router();
const authenticateToken = require('../tokenAuthMiddleware');
const Room = require('../models/room');
const Bookmark = require('../models/bookmark');
const postRouter = require('./post');
const photoRouter = require('./photo');

router.use(
  '/:roomId/posts',
  (req, res, next) => {
    req.roomId = req.params.roomId;
    next();
  },
  postRouter,
);
router.use(
  '/:roomId/photos',
  (req, res, next) => {
    req.roomId = req.params.roomId;
    next();
  },
  photoRouter,
);

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
      return res.status(400).json({ message: 'A room with this room code already exists' });
    }
    console.log(error.message);
    res.status(500).json({ message: error.message });
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
      return res.status(404).json({ message: 'Room not found' });
    }

    res.status(200).json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/', authenticateToken, async (req, res) => {
  const { page, pageSize, keyword } = req.query;
  const { userId } = req.user;

  const pageNumber = Number.parseInt(page) || 1;
  const limitNumber = Number.parseInt(pageSize) || 10;

  const searchQuery = {
    $or: [
      { roomCode: { $regex: keyword || '', $options: 'i' } },
      { roomName: { $regex: keyword || '', $options: 'i' } },
    ],
  };

  try {
    const numberOfRooms = await Room.countDocuments(searchQuery);
    const list = await Room.find(searchQuery)
      .populate('creator', 'username')
      .populate('modifier', 'username')
      .sort({ roomCode: 1 })
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber);

    const result = [...list];

    for (let i = 0; i < result.length; i++) {
      const room = result[i];
      const bookmark = await Bookmark.findOne({
        roomId: room._id,
        creator: userId,
      }).lean();
      if (bookmark) {
        const updatedRoom = {
          ...room.toObject(),
          isBookmarked: true,
          bookmarkId: bookmark._id.toString(),
        };
        result[i] = updatedRoom;
      }
    }

    const numberOfPages = Math.ceil(numberOfRooms / limitNumber);

    res.status(200).json({ numberOfPages, list: result });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { userId } = req.user;

  try {
    const room = await Room.findOneAndDelete({ _id: id, creator: userId });
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    res.status(200).json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

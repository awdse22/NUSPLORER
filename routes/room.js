const express = require('express');
const router = express.Router();
const authenticateToken = require('../tokenAuthMiddleware');
const Room = require('../models/room');
const Bookmark = require('../models/bookmark');
const postRouter = require('./post');
const photoRouter = require('./photo');
const mongoose = require('mongoose');

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
    const list = await Room.aggregate([
      {
        $match: searchQuery,
      },
      {
        $lookup: {
          from: 'reports',
          let: { roomId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$contentId', '$$roomId'] },
                    { $eq: ['$userId', new mongoose.Types.ObjectId(userId)] }
                  ]
                }
              }
            }
          ],
          as: 'reports'
        }
      },
      {
        $match: {
          $expr: { $eq: [{ $size: '$reports' }, 0] }
        }
      },
      {
        $sort: { roomCode: 1 }
      },
      {
        $skip: (pageNumber - 1) * limitNumber,
      },
      {
        $limit: limitNumber,
      }
    ]);
    const listWithRoomCreator = await Room.populate(list, { path: 'creator', select: 'username' });

    const roomIds = listWithRoomCreator.map(room => room._id);
    const bookmarks = await Bookmark.find({ room: { $in: roomIds }, userId: userId }).lean();
    const userBookmarks = {};
    bookmarks.forEach((bookmark) => {
      userBookmarks[bookmark.room.toString()] = bookmark._id.toString();
    });

    const listWithBookmarks = listWithRoomCreator.map((room) => {
      const roomId = room._id.toString();
      const roomBookmark = userBookmarks[roomId];
      if (roomBookmark) {
        return {
          ...room,
          isBookmarked: true,
          bookmarkId: roomBookmark
        }
      } else {
        return room;
      }
    })
    
    const numberOfPages = Math.ceil(numberOfRooms / limitNumber);

    res.status(200).json({ numberOfPages, list: listWithBookmarks });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: error.message });
  }
});

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

router.get('/:id', authenticateToken, async (req,res) => {
  // for getting data of a room, only for debugging and testing purposes
  const { id } = req.params;
  const postsData = await mongoose.model('Post').find({ roomId: id });
  const imagesData = await mongoose.model('ImageMetadata').find({ roomId: id });
  const reportsData = await mongoose.model('Report').find({ contentId: id, contentType: 'room' });
  return res.status(200).json({
    roomId: id,
    postsData: postsData,
    imagesData: imagesData,
    reportsData: reportsData
  })
})

module.exports = router;

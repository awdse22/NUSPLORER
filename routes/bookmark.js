const express = require('express');
const router = express.Router();
const authenticateToken = require('../tokenAuthMiddleware');
const Bookmark = require('../models/bookmark');
const Room = require('../models/room');

router.post('/', authenticateToken, async (req, res) => {
  const { userId } = req.user;
  const { roomId } = req.body;

  try {
    const room = await Room.findById(roomId);
    if (!room) {
      res.status(404).json({ 
        error: "The room you're trying to bookmark is not found/may have been deleted, refreshing page"
      })
    }

    const newBookmark = await Bookmark.create({
      userId: userId,
      room: roomId,
    });

    res.status(201).json(newBookmark);
  } catch (error) {
    console.log(error.message);
    if (error.code == 11000) {
      return res.status(500).json({ message: 'Bookmark already exists' });
    }
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { roomId } = req.body;
  const { userId } = req.user;

  try {
    const bookmark = await Bookmark.findOneAndUpdate(
      { _id: id },
      {
        roomId,
        modifier: userId,
        modifyTime: new Date(),
      },
      { new: true },
    );

    if (!bookmark) {
      return res.status(404).json({ message: 'Bookmark not found' });
    }

    res.status(200).json(bookmark);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/', authenticateToken, async (req, res) => {
  // Run the function to update the documents
  const { userId } = req.user;

  try {
    const bookmarks = await Bookmark.find({ userId: userId })
      .populate('room');
    res.status(200).json(bookmarks);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { userId } = req.user;
  const { roomId } = req.body;

  try {
    const room = await Room.findById(roomId);
    if (!room) {
      res.status(404).json({ 
        error: "The room is not found or may have been deleted, refreshing page"
      })
    }

    const bookmark = await Bookmark.findOneAndDelete({
      _id: id,
      userId: userId,
    });
    res.status(200).json(bookmark);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

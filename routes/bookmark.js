const express = require('express');
const router = express.Router();
const authenticateToken = require('../tokenAuthMiddleware');
const Bookmark = require('../models/bookmark');

router.post('/', authenticateToken, async (req, res) => {
  const { userId } = req.user;
  const { roomId } = req.body;

  try {
    const newBookmark = await Bookmark.create({
      creator: userId,
      modifier: userId,
      roomId,
      createTime: new Date(),
      modifyTime: new Date(),
    });
    res.status(201).json(newBookmark);
  } catch (error) {
    if (error.code == 11000) {
      return res.status(400).json({ error: 'Bookmark already exists' });
    }
    console.log(error.message);
    res.status(500).json({ error: error.message });
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
      return res.status(404).json({ error: 'Bookmark not found' });
    }

    res.status(200).json(bookmark);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const bookmarks = await Bookmark.find()
      .populate('roomId')
      .populate('creator', 'username')
      .populate('modifier', 'username');
    res.status(200).json(bookmarks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { userId } = req.user;

  try {
    const bookmark = await Bookmark.findOneAndDelete({ _id: id, creator: userId });
    if (!bookmark) {
      return res.status(404).json({ error: 'Bookmark not found' });
    }
    res.status(200).json(bookmark);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

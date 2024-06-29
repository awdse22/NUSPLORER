const express = require('express');
const router = express.Router();
const Post = require('../models/post');
const authenticateToken = require('../tokenAuthMiddleware');

router.post('/', authenticateToken, async (req, res) => {
  const { title, content } = req.body;
  const { userId } = req.user;
  const roomId = req.roomId;

  try {
    const newPost = await Post.create({
      roomId,
      title,
      content,
      creator: userId,
      createTime: new Date(),
      modifyTime: null,
    });
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;
  const { userId } = req.user;

  try {
    const post = await Post.findOneAndUpdate(
      { _id: id },
      {
        title,
        content,
        modifier: userId,
        modifyTime: new Date(),
      },
      { new: true },
    );

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/', async (req, res) => {
  const { page, pageSize, keyword } = req.query;
  const roomId = req.roomId;

  const pageNumber = Number.parseInt(page) || 1;
  const limitNumber = Number.parseInt(pageSize) || 10;

  const searchQuery = {
    roomId: roomId,
    $or: [
      { title: { $regex: keyword || '', $options: 'i' } },
      // { content: { $regex: keyword || '', $options: 'i' } },
    ],
  };

  try {
    const numberOfPosts = await Post.countDocuments(searchQuery);
    const list = await Post.find(searchQuery)
      .populate('creator', 'username')
      .sort({ modifyTime: -1 })
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber);
    const numberOfPages = Math.ceil(numberOfPosts / limitNumber);
    res.status(200).json({ numberOfPages, list });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { userId } = req.user;

  try {
    const post = await Post.findOneAndDelete({ _id: id, creator: userId });
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

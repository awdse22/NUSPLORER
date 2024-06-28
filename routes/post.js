const express = require('express');
const router = express.Router();
const Post = require('../models/post');
const authenticateToken = require('../tokenAuthMiddleware');

router.use(authenticateToken);

router.post('/savePost', async (req, res) => {
  const { title, content } = req.body;
  const { userId } = req.user;

  try {
    const newPost = await Post.create({
      title,
      content,
      creator: userId,
      modifier: userId,
      createTime: new Date(),
      modifyTime: new Date(),
    });
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/updatePost', async (req, res) => {
  const { _id, title, content } = req.body;
  const { userId } = req.user;

  try {
    const post = await Post.findOneAndUpdate(
      { _id },
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

router.post('/getPosts', async (req, res) => {
  const { page, pageSize, keyword } = req.body;

  const pageNumber = Number.parseInt(page) || 1;
  const limitNumber = Number.parseInt(pageSize) || 10;

  const searchQuery = {
    $or: [
      { title: { $regex: keyword || '', $options: 'i' } },
      { content: { $regex: keyword || '', $options: 'i' } },
    ],
  };

  try {
    const total = await Post.countDocuments(searchQuery);
    const list = await Post.find(searchQuery)
      .populate('creator', 'username')
      .populate('modifier', 'username')
      .sort({ modifyTime: -1 })
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber);

    res.status(200).json({ total, list });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/deletePost', async (req, res) => {
  const { _id } = req.body;
  const { userId } = req.user;

  try {
    const post = await Post.findOneAndDelete({ _id, creator: userId });
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

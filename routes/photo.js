const express = require('express');
const router = express.Router();
const Photo = require('../models/photo');
const authenticateToken = require('../tokenAuthMiddleware');

router.use(authenticateToken);

router.post('/', async (req, res) => {
  const { description, dataType, imageId } = req.body;
  const { userId } = req.user;
  const roomId = req.roomId;

  const photo = new Photo({
    description,
    dataType,
    imageId,
    roomId,
    creator: userId,
    createTime: new Date(),
  });
  try {
    await photo.save();
    res.status(201).send(photo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/', async (req, res) => {
  const { dataType, page, pageSize, description } = req.query;
  const roomId = req.roomId;
  const pageNumber = Number.parseInt(page) || 1;
  const limitNumber = Number.parseInt(pageSize) || 10;

  const searchQuery = { roomId: roomId };

  if (dataType) {
    searchQuery.dataType = dataType;
  }

  if (description) {
    searchQuery.description = { $regex: new RegExp(description, 'i') };
  }

  try {
    const total = await Photo.countDocuments(searchQuery);
    const list = await Photo.find(searchQuery)
      .populate('creator', 'username')
      .sort({ createTime: -1 })
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber);

    res.status(200).json({ total, list });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const { userId } = req.user;

  try {
    const photo = await Photo.findOneAndDelete({ _id: id, creator: userId });
    if (!photo) {
      return res.status(404).json({ error: 'Photo not found' });
    }
    res.status(200).json(photo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

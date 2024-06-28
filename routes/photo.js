const express = require('express');
const router = express.Router();
const Photo = require('../models/photo');
const authenticateToken = require('../tokenAuthMiddleware');

router.use(authenticateToken);

router.post('/photos', async (req, res) => {
  const { description, dataType, imageId, roomId } = req.body;
  const { userId } = req.user;
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

router.get('/photos', async (req, res) => {
  const { roomId, dataType, page, pageSize, description } = req.query;
  const pageNumber = Number.parseInt(page) || 1;
  const limitNumber = Number.parseInt(pageSize) || 10;

  const searchQuery = { roomId };

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
      .sort({ modifyTime: -1 })
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber);

    res.status(200).json({ total, list });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/photos/:id', async (req, res) => {
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

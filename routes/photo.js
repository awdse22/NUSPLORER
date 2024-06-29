const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const ImageMetadata = require('../models/imageMetadata');
const Image = require('../models/image');
const authenticateToken = require('../tokenAuthMiddleware');

router.post('/', authenticateToken, async (req, res) => {
  const { description, dataType, imageData } = req.body;
  const { userId } = req.user;
  const roomId = req.roomId;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const matches = imageData.match(/^data:(image\/\w+);base64,(.+)$/);
    if (!matches) {
      throw new Error('Invalid base64 image string');
    }
    const imageType = matches[1];    
    const base64Data = matches[2];
    const buffer = Buffer.from(base64Data, 'base64');

    const newImage = new Image({
      data: buffer.toString('base64'),
      imageType: imageType
    });

    const savedImage = await newImage.save({ session });
    const imageId = savedImage._id;

    const imageMetadata = new ImageMetadata({
      roomId,
      description,
      dataType,
      imageId,
      creator: userId,
      createTime: new Date(),
    });
    await imageMetadata.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.status(201).send(imageMetadata);
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    console.log(error);

    res.status(500).json({ error: 'Failed to upload image' });
  }
});

router.get('/', async (req, res) => {
  const { dataType } = req.query;
  const roomId = req.roomId;

  const searchQuery = { roomId: roomId };

  if (dataType) {
    searchQuery.dataType = dataType;
  }
  
  /*
  if (description) {
    searchQuery.description = { $regex: new RegExp(description, 'i') };
  }
    */

  try {
    const list = await ImageMetadata.find(searchQuery)
      .populate('creator', 'username')
      .populate({
        path: 'imageId',
        select: 'imageType data',
      })
      .sort({ createTime: -1 })

    res.status(200).send(list);
  } catch (error) {
    res.status(500).json({ error: error.message });
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

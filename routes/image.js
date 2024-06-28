const express = require('express');
const router = express.Router();
const Image = require('../models/image');
const authenticateToken = require('../tokenAuthMiddleware');

router.use(authenticateToken);

router.get('/image/:id', async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);

    if (!image) {
      return res.status(404).json({ error: 'Image not found' });
    }

    const imageUrl = `data:image/jpeg;base64,${image.data}`;

    res.json({ imageUrl });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve image' });
  }
});

router.post('/upload', async (req, res) => {
  try {
    const base64Data = req.body.imageData.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');

    const newImage = new Image({
      data: buffer.toString('base64'),
    });

    const savedImage = await newImage.save();

    res.status(201).json({
      message: 'Image uploaded successfully',
      imageId: savedImage._id,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to upload image' });
  }
});

module.exports = router;

const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const authenticateToken = require('../tokenAuthMiddleware');
const Report = require('../models/report');
const Room = require('../models/room');
const Post = require('../models/post');
const ImageMetadata = require('../models/imageMetadata');
const Image = require('../models/image');
const Vote = require('../models/vote');

// number of reports for the same reason before a data/content is deleted
const maxReports = 3; 
const reasons = [ 'Inappropriate/Offensive/Irrelevant', 'Inaccurate/Outdated' ];

router.post('/:contentId', authenticateToken, async (req, res) => {
  const { userId } = req.user;
  const { contentId } = req.params;
  const { contentType, reason } = req.body;

  const contentTypes = ['post', 'image', 'room'];
  if (!contentTypes.includes(contentType)) {
    return res.status(400).json({ error: 'Invalid content type' });
  }
  if (!reasons.includes(reason)) {
    return res.status(400).json({ error: 'Invalid reason' });
  }

  try {
    // verify validity of content and report
    let content;
    if (contentType == 'post') {
      content = await Post.findById(contentId);
    } else if (contentType == 'image') {
      content = await ImageMetadata.findById(contentId);
    } else if (contentType == 'room') {
      content = await Room.findById(contentId);
    }

    if (!content) {
      return res.status(404).json({ error: `The ${contentType} is not found or may have been deleted` });
    }

    const reportCheck = await Report.findOne({ userId: userId, contentId: contentId });
    if (reportCheck) {
      return res.status(400).json({ error: `You have already reported this ${contentType}!`});
    }
  } catch (error) {
    console.error('Error verifying data/report: ', error.message);
    return res.status(500).json({ error: error.message });
  }
  
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    let contentDeleted = false;
    const userReport = new Report({
      contentId,
      contentType,
      userId,
      reason
    });
    const savedReport = await userReport.save({ session });

    const reportCount = await Report.countDocuments({ contentId, reason });
    if (reportCount >= maxReports - 1 ) {
      if (contentType == 'post') {
        await Post.deleteByPostId(contentId, session);
      } else if (contentType == 'image') {
        await ImageMetadata.deleteByImageMetadataId(contentId, session);
      } else if (contentType == 'room') {
        await Room.deleteRoomWithData(contentId, session);
      }
      console.log(`${contentType} ${contentId} successfully deleted`);
      contentDeleted = true;
    }

    await session.commitTransaction();
    session.endSession();
    console.log(`User ${userId} has reported ${contentType} ${contentId} for ${reason}`);

    return res.status(201).json({ 
      report: savedReport, 
      contentType: contentType, 
      contentDeleted: contentDeleted
    });
  } catch (error) {
    console.log('reached here');
    await session.abortTransaction();
    session.endSession();
    console.error('Error making a report: ', error.message);
    return res.status(500).json({ message: error.message });
  }
});

module.exports = router;

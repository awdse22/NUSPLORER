const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const ImageMetadata = require('../models/imageMetadata');
const Image = require('../models/image');
const authenticateToken = require('../tokenAuthMiddleware');
const Vote = require('../models/vote');

router.get('/', authenticateToken, async (req, res) => {
  const { dataType } = req.query;
  const roomId = req.roomId;
  const { userId } = req.user;

  if (!dataType) {
    return res.status(400).json({ error: 'Invalid data type requested'})
  }

  const searchQuery = { 
    roomId: new mongoose.Types.ObjectId(roomId),
    dataType: dataType
  };
  
  /*
  if (description) {
    searchQuery.description = { $regex: new RegExp(description, 'i') };
  }
    */

  try {
    const imageMetadataList = await ImageMetadata.aggregate([
      {
        $match: searchQuery
      },
      {
        $addFields: {
          voteCount: { $subtract: ['$upvoteCount', '$downvoteCount'] },
          sameUser: { $eq: ['$creator', new mongoose.Types.ObjectId(userId)] }
        }
      },
      {
        $sort: {
          voteCount: -1,
          createTime: -1
        }
      }
    ]);

    const listWithUserAndImageData = await ImageMetadata.populate(
      imageMetadataList,
      [
        { path: 'creator', select: 'username' },
        { path: 'imageId', select: 'imageType data'}
      ]
    );
    
    const imageMetadataIds = listWithUserAndImageData.map(image => image._id);
    // Fetch info of whether the user has upvoted of downvoted the list of images
    const votesMadeByUser = await Vote.find({
      userId,
      postId: { $in: imageMetadataIds }
    });
    const userVotes = {};
    votesMadeByUser.forEach(vote => {
      userVotes[vote.postId.toString()] = vote.value;
    });

    const listWithUserVoteInfo = listWithUserAndImageData.map(image => {
      const userVote = userVotes[image._id.toString()];
      return {
        ...image,
        userVote: userVote || 0
      };
    });

    res.status(200).send(listWithUserVoteInfo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

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

router.put('/:id', authenticateToken, async (req, res) => {
  const { userId } = req.user;
  const { id } = req.params;
  const { description } = req.body;

  try {
    const imageMetadata = await ImageMetadata.findById(id);
    if (!imageMetadata) {
      return res.status(404).json({ 
        error: "The image description you're trying to edit is not found or has been deleted" 
      });
    }
    if (imageMetadata.creator.toString() !== userId) {
      return res.status(403).json({ 
        error: 'You do not have the permission to edit this description!'
      })
    }

    const updatedMetadata = await ImageMetadata.findOneAndUpdate(
      { _id: id },
      {
        description
      },
      { new: true },
    );

    res.status(200).json(updatedMetadata);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { userId } = req.user;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const imageMetadata = await ImageMetadata.findById(id);
    if (!imageMetadata) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ 
        error: 'The image is not found or may have been deleted' 
      });
    }

    if (imageMetadata.creator == userId) {
      await ImageMetadata.deleteByImageMetadataId(id, session);
      await session.commitTransaction();
      session.endSession();
      return res.status(200).json(imageMetadata);
    } else {
      await session.abortTransaction();
      session.endSession();
      return res.status(403).json({ 
        error: "You're not authorized to deleted this image" 
      })
    }
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id/vote', authenticateToken, async (req, res) => {
  const { userId } = req.user;
  const { id: imageMetadataId } = req.params;
  // -1 if downvote, 0 if no vote, 1 if upvote
  const { initialVoteValue, updatedVoteValue } = req.body;

  if (initialVoteValue == updatedVoteValue) {
    return res.status(400).json({ error: 'Updated vote cannot be the same as initial vote'});
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    let updateVoteCount = { $inc: {} };
    if (initialVoteValue == -1) {
      updateVoteCount.$inc.downvoteCount = -1;
    } else if (initialVoteValue == 1) {
      updateVoteCount.$inc.upvoteCount = -1;
    }
    if (updatedVoteValue == 0) {
      await Vote.deleteOne({ postId: imageMetadataId, userId: userId }).session(session);
      const updatedMetadata = await ImageMetadata.findOneAndUpdate(
        { _id: imageMetadataId },
        updateVoteCount,
        { new: true }
      ).session(session);

      await session.commitTransaction();
      session.endSession();
      return res.status(200).json(updatedMetadata);
    } else {
      if (updatedVoteValue == 1) {
        updateVoteCount.$inc.upvoteCount = 1;
      } else if (updatedVoteValue == -1) {
        updateVoteCount.$inc.downvoteCount = 1;
      }
      
      await Vote.findOneAndUpdate(
        { postId: imageMetadataId, userId: userId },
        { value: updatedVoteValue },
        { upsert: true, new: true }
      ).session(session);

      const updatedMetadata = await ImageMetadata.findOneAndUpdate(
        { _id: imageMetadataId },
        updateVoteCount,
        { new: true }
      ).session(session);

      await session.commitTransaction();
      session.endSession();
      return res.status(200).json(updatedMetadata);
    }
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.log(error);
    res.status(500).json({ error: 'Failed to update votes'});
  }
});

module.exports = router;

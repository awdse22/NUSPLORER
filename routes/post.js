const express = require('express');
const router = express.Router();
const Post = require('../models/post');
const Vote = require('../models/vote');
const authenticateToken = require('../tokenAuthMiddleware');
const mongoose = require('mongoose');

router.get('/', authenticateToken, async (req, res) => {
  const { page, pageSize, keyword } = req.query;
  const roomId = req.roomId;
  const { userId } = req.user;

  const pageNumber = Number.parseInt(page) || 1;
  const limitNumber = Number.parseInt(pageSize) || 10;

  const searchQuery = {
    roomId: new mongoose.Types.ObjectId(roomId),
    $or: [
      { title: { $regex: keyword || '', $options: 'i' } },
    ],
  };

  try {
    const numberOfPosts = await Post.countDocuments(searchQuery);
    const postList = await Post.aggregate([
      {
        $match: searchQuery
      },
      {
        $addFields: {
          voteCount: { $subtract: ['$upvoteCount', '$downvoteCount'] },
          latestModification: {
            $cond: {
              if : { $eq: [ '$modifyTime', null] },
              then: '$createTime',
              else: '$modifyTime'
            }
          },
          sameUser: { $eq: ['$creator', new mongoose.Types.ObjectId(userId)] }
        }
      },
      {
        $sort: {
          voteCount: -1,
          latestModification: -1
        }
      },
      {
        $skip: (pageNumber - 1) * limitNumber
      },
      {
        $limit: limitNumber
      }
    ]);

    const postsWithUsernames = await Post.populate(postList, { path: 'creator', select: 'username' });

    const postIds = postsWithUsernames.map(post => post._id);
    // Fetch info of whether the user has upvoted or downvoted the listed posts
    const votesMadeByUser = await Vote.find({
      userId,
      postId: { $in: postIds }
    });
    const userVotes = {};
    votesMadeByUser.forEach(vote => {
      userVotes[vote.postId.toString()] = vote.value;
    });

    const postsWithUserVoteInfo = postsWithUsernames.map(post => {
      const postId = post._id.toString();
      const userVote = userVotes[postId];
      return {
        ...post,
        userVote: userVote || 0
      };
    });

    const numberOfPages = Math.ceil(numberOfPosts / limitNumber);
    res.status(200).json({ numberOfPages, postsWithUserVoteInfo });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: error.message });
  }
});

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
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    if (post.creator.toString() !== userId) {
      return res.status(403).json({ error: 'You do not have the permission to edit this post!'});
    }

    const updatedPost = await Post.findOneAndUpdate(
      { _id: id },
      {
        title,
        content,
        modifyTime: new Date(),
      },
      { new: true },
    );

    res.status(200).json(updatedPost);
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
    const post = await Post.findById(id);
    if (!post) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ 
        error: 'The post is not found or may have been deleted' 
      });
    }

    if (post.creator == userId) {
      await Post.deleteByPostId(id, session);
      await session.commitTransaction();
      session.endSession();
      return res.status(200).json(post);
    } else {
      await session.abortTransaction();
      session.endSession();
      return res.status(403).json({ 
        error: "You're not authorized to deleted this post" 
      })
    }
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return res.status(500).json({ error: error.message });
  }
});

router.put('/:id/vote', authenticateToken, async (req, res) => {
  const { userId } = req.user;
  const { id: postId } = req.params;
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
      await Vote.deleteOne({ postId: postId, userId: userId }).session(session);
      const updatedPost = await Post.findOneAndUpdate(
        { _id: postId },
        updateVoteCount,
        { new: true }
      ).session(session);

      await session.commitTransaction();
      session.endSession();
      return res.status(200).json(updatedPost);
    } else {
      if (updatedVoteValue == 1) {
        updateVoteCount.$inc.upvoteCount = 1;
      } else if (updatedVoteValue == -1) {
        updateVoteCount.$inc.downvoteCount = 1;
      }
      
      await Vote.findOneAndUpdate(
        { postId: postId, userId: userId },
        { value: updatedVoteValue },
        { upsert: true, new: true }
      ).session(session);

      const updatedPost = await Post.findOneAndUpdate(
        { _id: postId },
        updateVoteCount,
        { new: true }
      ).session(session);

      await session.commitTransaction();
      session.endSession();
      return res.status(200).json(updatedPost);
    }
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.log(error);
    res.status(500).json({ error: 'Failed to update votes'});
  }
});

module.exports = router;

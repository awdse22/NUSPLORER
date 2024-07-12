const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const authenticateToken = require('../tokenAuthMiddleware');
const Report = require('../models/report');
const Post = require('../models/post');
const ImageMetadata = require('../models/imageMetadata');
const Image = require('../models/image');
const Vote = require('../models/vote');

// number of reports for the same reason before a data/content is deleted
const maxReports = 3; 

router.post('/:contentId', authenticateToken, async (req, res) => {
    const { userId } = req.user;
    const { contentId } = req.params;
    const { contentType, reason } = req.body;

    const contentTypes = ['post', 'image'];
    const reasons = [ 'Inappropriate/Offensive/Irrelevant', 'Inaccurate/Outdated' ];
    if (!contentTypes.includes(contentType)) {
        return res.status(400).json({ error: 'Invalid content type' });
    }
    if (!reasons.includes(reason)) {
        return res.status(400).json({ error: 'Invalid reason' });
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const reportCheck = await Report.findOne({ userId: userId, contentId: contentId });
        if (reportCheck) {
            return res.status(400).json({ error: `You have already reported this ${contentType}!`});
        }

        const userReport = new Report({
            contentId,
            contentType,
            userId,
            reason
        });
        const savedReport = await userReport.save({ session });

        let deletedContent;
        const reportCount = await Report.countDocuments({ contentId, reason });
        console.log(`Report count: ${reportCount}`);
        if (reportCount >= maxReports - 1 ) {
            console.log('deleting content');
            if (contentType == 'post') {
                deletedContent = await Post.findByIdAndDelete(contentId, { session });
            } else if (contentType == 'image') {
                deletedContent = await ImageMetadata.findByIdAndDelete(contentId, { session });
                await Image.findByIdAndDelete(deletedContent.imageId, { session });
            }

            if (deletedContent) {
                await Report.deleteMany({ contentId }).session(session);
                await Vote.deleteMany({ postId: contentId }).session(session);
                console.log(`Deleted the following content:`, deletedContent);
            } else {
                await session.abortTransaction();
                session.endSession();
                return res.status(404).json({ error: `${contentType} not found` });
            }
        }

        await session.commitTransaction();
        session.endSession();
        console.log(`User ${userId} has reported ${contentType} ${contentId} for ${reason}`);

        return res.status(201).json({ 
            report: savedReport, 
            contentType: contentType, 
            deletedContent: deletedContent 
        });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error('Error making a report: ', error.message);
        return res.status(500).json({ error: error.message });
    }
});

router.get('/:contentId/vote', async (req, res) => {
    // get vote data of a post, ONLY FOR DEBUGGING PURPOSES
    // used to check whether all votes under a content are deleted properly
    const { contentId: contentId } = req.params;
    const upvoteCount = await Vote.countDocuments({ postId: contentId, value: 1 });
    const downvoteCount = await Vote.countDocuments({ postId: contentId, value: -1 });
    const totalVoteCount = upvoteCount - downvoteCount;
    const voteData = await Vote.find({ postId: contentId });
    return res.status(200).json({
      upvoteCount: upvoteCount,
      downvoteCount: downvoteCount,
      totalVoteCount: totalVoteCount,
      voteData: voteData
    });
  })

module.exports = router;
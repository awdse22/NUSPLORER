const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const postSchema = new Schema({
  roomId: {
    type: Schema.Types.ObjectId,
    ref: 'Room',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createTime: {
    type: Date,
    default: Date.now,
  },
  modifyTime: {
    type: Date,
  },
  upvoteCount: {
    type: Number,
    default: 0
  },
  downvoteCount: {
    type: Number,
    default: 0
  }
});

postSchema.statics.deleteByPostId = async function(postId, session) {
  try {
    const post = await this.findById(postId).session(session);
    if (post) {
      await mongoose.model('Report').deleteMany({ contentId: postId }).session(session);
      await mongoose.model('Vote').deleteMany({ postId: postId }).session(session);
      await this.findByIdAndDelete(post._id).session(session);
    }
  } catch (error) {
    throw new Error('Error deleting post: ' + error.message);
  }
}

postSchema.statics.deleteByRoomId = async function(roomId, session) {
  try {
    const posts = await this.find({ roomId: roomId }).session(session);
    const postIds = posts.map(data => data._id);

    await mongoose.model('Report').deleteMany({ contentId: { $in: postIds } }).session(session);
    await mongoose.model('Vote').deleteMany({ postId: { $in: postIds } }).session(session);
    await this.deleteMany({ roomId: roomId }).session(session);
  } catch (error) {
    throw new Error('Error deleting posts for room: ' + error.message);
  }
}

const Post = model('Post', postSchema);

module.exports = Post;

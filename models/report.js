const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const reportSchema = new Schema({
  contentId: {
    type: Schema.Types.ObjectId,
    ref: 'Content',
    required: true,
  },
  contentType: {
    type: String,
    ref: 'Content Type',
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  reason: {
    type: String,
    enum: [ 'Inappropriate/Offensive/Irrelevant', 'Inaccurate/Outdated' ],
    required: true,
  }
});

const Report = model('Report', reportSchema);

module.exports = Report;

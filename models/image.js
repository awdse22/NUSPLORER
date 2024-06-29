const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const imageSchema = new Schema({
  data: {
    type: String,
    required: true,
  },
  imageType: {
    type: String,
    required: true,
  }
});

const Image = model('Image', imageSchema);

module.exports = Image;

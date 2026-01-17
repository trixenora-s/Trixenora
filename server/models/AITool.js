const mongoose = require('mongoose');

const aiToolSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: String,
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    enum: ['image-generation', 'text-generation', 'video-generation', 'code-generation', 'data-analysis', 'other']
  },
  version: String,
  documentation: String,
  apiEndpoint: String,
  fileUrl: String,
  fileSize: Number,
  thumbnail: String,
  downloads: {
    type: Number,
    default: 0
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviews: [{
    userId: mongoose.Schema.Types.ObjectId,
    rating: Number,
    comment: String,
    date: Date
  }],
  status: {
    type: String,
    enum: ['development', 'beta', 'released', 'deprecated'],
    default: 'development'
  },
  requirements: String,
  tags: [String],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: Date
});

module.exports = mongoose.model('AITool', aiToolSchema);

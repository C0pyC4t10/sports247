const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    default: 'Untitled Video'
  },
  prompt: {
    type: String,
    required: true
  },
  theme: {
    type: String,
    required: true
  },
  region: {
    type: String,
    default: 'Norway'
  },
  videoUrl: {
    type: String,
    default: ''
  },
  thumbnailUrl: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed'],
    default: 'pending'
  },
  duration: {
    type: Number,
    default: 0
  },
  likes: {
    type: Number,
    default: 0
  },
  views: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

videoSchema.index({ createdAt: -1 });
videoSchema.index({ theme: 1 });
videoSchema.index({ region: 1 });

module.exports = mongoose.model('Video', videoSchema);
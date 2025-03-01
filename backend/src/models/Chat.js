const mongoose = require('mongoose');

const ChatSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    default: '',
    trim: true,
  },
  type: {
    type: String,
    enum: ['public', 'private'],
    default: 'public',
  },
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  messages: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message',
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

const Chat = mongoose.model('Chat', ChatSchema);

module.exports = Chat;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  displayName: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address.'],
  },
  settings: {
    theme: {
      type: String,
      default: 'theme-green',
    },
    terminalFont: {
      type: String,
      default: 'Fira Code',
    },
    fontSize: {
      type: String,
      default: '16px',
    },
    showScanLines: {
      type: Boolean,
      default: true,
    },
    terminalSounds: {
      type: Boolean,
      default: true,
    },
  },
  whatsapp: {
    connected: {
      type: Boolean,
      default: false,
    },
    phoneNumber: String,
    authToken: String,
  },
  instagram: {
    connected: {
      type: Boolean,
      default: false,
    },
    username: String,
    authToken: String,
  },
  lastLoginAt: Date,
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

// Pre-save middleware to hash password
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
UserSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Set displayName to username if not provided
UserSchema.pre('save', function(next) {
  if (!this.displayName) {
    this.displayName = this.username;
  }
  next();
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
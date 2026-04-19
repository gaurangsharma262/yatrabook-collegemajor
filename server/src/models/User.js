const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const recentSearchSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['train', 'flight', 'bus'],
    required: true,
  },
  from: { type: String, required: true },
  to: { type: String, required: true },
  date: { type: Date },
  searchedAt: { type: Date, default: Date.now },
}, { _id: false });

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: 2,
    maxlength: 50,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6,
    select: false, // Don't include password in queries by default
  },
  phone: {
    type: String,
    trim: true,
    default: '',
  },
  avatar: {
    type: String,
    default: '',
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  recentSearches: {
    type: [recentSearchSchema],
    default: [],
    validate: {
      validator: function (arr) {
        return arr.length <= 20; // Max 20 recent searches
      },
      message: 'Recent searches limit exceeded',
    },
  },
}, {
  timestamps: true,
});

// Index already defined via unique:true on email field

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Remove password from JSON output
userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};

// Add recent search (keep max 20, newest first)
userSchema.methods.addRecentSearch = async function (searchData) {
  // Remove duplicate if exists
  this.recentSearches = this.recentSearches.filter(
    (s) => !(s.type === searchData.type && s.from === searchData.from && s.to === searchData.to)
  );
  // Add to beginning
  this.recentSearches.unshift({
    ...searchData,
    searchedAt: new Date(),
  });
  // Trim to 20
  if (this.recentSearches.length > 20) {
    this.recentSearches = this.recentSearches.slice(0, 20);
  }
  return this.save();
};

module.exports = mongoose.model('User', userSchema);

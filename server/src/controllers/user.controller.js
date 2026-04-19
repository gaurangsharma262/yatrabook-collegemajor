const User = require('../models/User');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');

const getProfile = async (req, res, next) => {
  try {
    ApiResponse.ok(req.user, 'Profile retrieved').send(res);
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const { name, phone, avatar } = req.body;
    const user = await User.findById(req.user._id);

    if (name) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (avatar !== undefined) user.avatar = avatar;

    await user.save();
    ApiResponse.ok(user, 'Profile updated successfully').send(res);
  } catch (error) {
    next(error);
  }
};

const getRecentSearches = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    ApiResponse.ok(user.recentSearches, 'Recent searches retrieved').send(res);
  } catch (error) {
    next(error);
  }
};

const clearRecentSearches = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    user.recentSearches = [];
    await user.save();
    ApiResponse.ok(null, 'Recent searches cleared').send(res);
  } catch (error) {
    next(error);
  }
};

module.exports = { getProfile, updateProfile, getRecentSearches, clearRecentSearches };

const authService = require('../services/auth.service');
const ApiResponse = require('../utils/ApiResponse');

const register = async (req, res, next) => {
  try {
    const result = await authService.register(req.body);
    ApiResponse.created(result, 'Account created successfully').send(res);
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const result = await authService.login(req.body);
    ApiResponse.ok(result, 'Login successful').send(res);
  } catch (error) {
    next(error);
  }
};

const getMe = async (req, res, next) => {
  try {
    const user = await authService.getCurrentUser(req.user._id);
    ApiResponse.ok(user, 'User profile retrieved').send(res);
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    // JWT is stateless — client should discard token
    ApiResponse.ok(null, 'Logged out successfully').send(res);
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, getMe, logout };

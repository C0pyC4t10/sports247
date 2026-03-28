const userStore = require('../services/userStore');
const jwt = require('jsonwebtoken');

const generateToken = (user) => {
  return jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

exports.register = (req, res) => {
  try {
    const { username, email, password } = req.body;

    const allUsers = userStore.getAllUsers();
    for (const user of allUsers.values()) {
      if (user.email === email || user.username === username) {
        return res.status(400).json({
          success: false,
          message: 'User already exists with this email or username'
        });
      }
    }

    const user = {
      username,
      email,
      password,
      role: 'user',
      credits: 10,
      createdAt: new Date()
    };

    const savedUser = Object.assign({ id: userStore.getAllUsers().size + 1 }, user);
    userStore.getAllUsers().set(savedUser.id, savedUser);

    const token = generateToken(savedUser);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: savedUser.id,
        username: savedUser.username,
        email: savedUser.email,
        role: savedUser.role,
        credits: savedUser.credits
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.login = (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    let foundUser = null;
    const allUsers = userStore.getAllUsers();
    for (const user of allUsers.values()) {
      if (user.email === email) {
        foundUser = user;
        break;
      }
    }

    if (!foundUser || foundUser.password !== password) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const token = generateToken(foundUser);

    res.json({
      success: true,
      token,
      user: {
        id: foundUser.id,
        username: foundUser.username,
        email: foundUser.email,
        role: foundUser.role,
        credits: foundUser.credits
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.logout = (req, res) => {
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
};

exports.getMe = (req, res) => {
  try {
    const user = userStore.getUserById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        credits: user.credits
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
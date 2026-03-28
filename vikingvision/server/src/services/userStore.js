const users = new Map();
const videos = new Map();
const sessions = new Map();
const jwt = require('jsonwebtoken');

let userIdCounter = 1;
let videoIdCounter = 1;

const generateToken = (user) => {
  return jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    for (const user of users.values()) {
      if (user.email === email || user.username === username) {
        return res.status(400).json({
          success: false,
          message: 'User already exists with this email or username'
        });
      }
    }

    const user = {
      id: userIdCounter++,
      username,
      email,
      password,
      role: 'user',
      credits: 10,
      createdAt: new Date()
    };

    users.set(user.id, user);

    const token = generateToken(user);

    res.status(201).json({
      success: true,
      token,
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

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    let foundUser = null;
    for (const user of users.values()) {
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

exports.getMe = async (req, res) => {
  try {
    const user = users.get(req.user.id);
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

exports.getAllUsers = () => users;
exports.getUserById = (id) => users.get(id);
exports.updateUser = (id, data) => {
  const user = users.get(id);
  if (user) {
    Object.assign(user, data);
    users.set(id, user);
  }
  return user;
};
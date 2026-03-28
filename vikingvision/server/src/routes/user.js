const express = require('express');
const router = express.Router();
const userStore = require('../services/userStore');
const { protect } = require('../middleware/auth');

router.get('/profile', protect, (req, res) => {
  try {
    const user = userStore.getUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    const { password, ...userWithoutPassword } = user;
    res.json({ success: true, user: userWithoutPassword });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put('/profile', protect, (req, res) => {
  try {
    const { username } = req.body;
    const user = userStore.updateUser(req.user.id, { username });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    const { password, ...userWithoutPassword } = user;
    res.json({ success: true, user: userWithoutPassword });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/credits', protect, (req, res) => {
  try {
    const user = userStore.getUserById(req.user.id);
    res.json({ success: true, credits: user.credits });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/credits/add', protect, (req, res) => {
  try {
    const { amount } = req.body;
    const user = userStore.updateUser(req.user.id, { credits: user.credits + amount });
    res.json({ success: true, credits: user.credits });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
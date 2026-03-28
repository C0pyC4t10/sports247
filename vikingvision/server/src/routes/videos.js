const express = require('express');
const router = express.Router();
const {
  generateVideo,
  getVideos,
  getVideoById,
  getUserVideos,
  deleteVideo,
  likeVideo,
  getThemes,
  getRegions
} = require('../controllers/videoController');
const { protect } = require('../middleware/auth');

router.get('/themes', getThemes);
router.get('/regions', getRegions);

router.post('/generate', protect, generateVideo);
router.get('/', getVideos);
router.get('/my-videos', protect, getUserVideos);
router.get('/:id', getVideoById);
router.delete('/:id', protect, deleteVideo);
router.post('/:id/like', protect, likeVideo);

module.exports = router;
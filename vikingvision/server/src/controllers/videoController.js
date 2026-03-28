const videoStore = require('../services/videoStore');
const userStore = require('../services/userStore');

exports.generateVideo = (req, res) => {
  try {
    const user = userStore.getUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.credits < 1) {
      return res.status(400).json({ success: false, message: 'Insufficient credits' });
    }

    const { prompt, theme, region, duration } = req.body;

    if (!prompt || !theme) {
      return res.status(400).json({ success: false, message: 'Prompt and theme are required' });
    }

    const videoDuration = duration || 10;
    const video = videoStore.generateVideo(user, prompt, theme, region || 'Norway', videoDuration);

    user.credits -= 1;
    userStore.updateUser(user.id, { credits: user.credits });

    res.status(201).json({
      success: true,
      video: {
        id: video.id,
        prompt: video.prompt,
        theme: video.theme,
        region: video.region,
        videoUrl: video.videoUrl,
        status: video.status,
        createdAt: video.createdAt
      },
      credits: user.credits
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getVideos = (req, res) => {
  try {
    const { page = 1, limit = 12, theme, region, sort = 'newest' } = req.query;

    const result = videoStore.getVideos({ page, limit, theme, region, sort });

    res.json({
      success: true,
      videos: result.videos,
      pagination: {
        page: result.page,
        limit: parseInt(limit),
        total: result.total,
        pages: result.pages
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getVideoById = (req, res) => {
  try {
    const video = videoStore.getVideoById(parseInt(req.params.id));

    if (!video) {
      return res.status(404).json({ success: false, message: 'Video not found' });
    }

    res.json({ success: true, video });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getUserVideos = (req, res) => {
  try {
    const allVideos = videoStore.getAllVideos();
    const userVideos = Array.from(allVideos.values())
      .filter(v => v.userId === req.user.id)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json({ success: true, videos: userVideos });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteVideo = (req, res) => {
  try {
    const video = videoStore.getVideoById(parseInt(req.params.id));

    if (!video || video.userId !== req.user.id) {
      return res.status(404).json({ success: false, message: 'Video not found' });
    }

    videoStore.deleteVideo(parseInt(req.params.id));

    res.json({ success: true, message: 'Video deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.likeVideo = (req, res) => {
  try {
    const likes = videoStore.likeVideo(parseInt(req.params.id));

    if (likes === null) {
      return res.status(404).json({ success: false, message: 'Video not found' });
    }

    res.json({ success: true, likes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getThemes = (req, res) => {
  const themes = videoStore.getThemes();
  res.json({ success: true, themes: Object.keys(themes).map(key => ({ key, name: themes[key] })) });
};

exports.getRegions = (req, res) => {
  res.json({ success: true, regions: videoStore.getRegions() });
};
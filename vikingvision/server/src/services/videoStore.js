const videos = new Map();
let videoIdCounter = 1;

const SAMPLE_VIDEOS = [
  'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
  'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_2mb.mp4',
  'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_5mb.mp4'
];

const DEMO_VIDEOS = [
  { prompt: 'Viking warriors sailing through icy fjords at sunset', theme: 'mountains', region: 'Norway', likes: 45, views: 234 },
  { prompt: 'Ancient Viking village with longhouses and smoke', theme: 'life', region: 'Denmark', likes: 38, views: 189 },
  { prompt: 'Viking raiders in battle gear preparing for raid', theme: 'kingdoms', region: 'Iceland', likes: 62, views: 312 },
  { prompt: 'Frost-covered Viking settlement in deep winter', theme: 'snows', region: 'Sweden', likes: 29, views: 156 },
  { prompt: 'Viking traders exchanging goods at a market', theme: 'culture', region: 'England', likes: 51, views: 278 },
  { prompt: 'Longship sailing through misty ocean waves', theme: 'ocean', region: 'Norway', likes: 73, views: 445 },
  { prompt: 'Viking blacksmith forging weapons in forge', theme: 'life', region: 'Denmark', likes: 34, views: 198 },
  { prompt: 'Viking explorers discovering new lands', theme: 'wild', region: 'Greenland', likes: 56, views: 289 },
  { prompt: 'Sacred Viking ritual under ancient trees', theme: 'culture', region: 'Scotland', likes: 41, views: 234 },
  { prompt: 'Viking fleet sailing down a river', theme: 'rivers', region: 'Russia', likes: 67, views: 378 },
  { prompt: 'Viking kingdom castle on a cliff', theme: 'kingdoms', region: 'Ireland', likes: 52, views: 267 },
  { prompt: 'Nomadic Viking families traveling across tundra', theme: 'native', region: 'Iceland', likes: 28, views: 145 }
];

const getRandomDuration = () => Math.floor(Math.random() * 16) + 5;

DEMO_VIDEOS.forEach((video, index) => {
  const id = videoIdCounter++;
  videos.set(id, {
    id,
    userId: 999,
    username: 'Demo',
    ...video,
    videoUrl: SAMPLE_VIDEOS[index % SAMPLE_VIDEOS.length],
    thumbnailUrl: '',
    status: 'completed',
    duration: getRandomDuration(),
    createdAt: new Date(Date.now() - index * 3600000)
  });
});

const THEMES = {
  mountains: 'Mountains',
  snows: 'Snows',
  wild: 'Wild',
  forest: 'Forest',
  life: 'Life',
  culture: 'Culture',
  ocean: 'Ocean',
  rivers: 'Rivers',
  kingdoms: 'Kingdoms',
  native: 'Native',
  countries: 'Countries'
};

const REGIONS = [
  'Norway', 'Denmark', 'Sweden', 'Iceland', 'Greenland',
  'England', 'France', 'Russia', 'Italy', 'Ireland', 'Scotland'
];

exports.getAllVideos = () => videos;
exports.getThemes = () => THEMES;
exports.getRegions = () => REGIONS;
exports.getDemoVideos = () => DEMO_VIDEOS;

exports.generateVideo = (user, prompt, theme, region, duration = 10) => {
  const id = videoIdCounter++;
  const video = {
    id,
    userId: user.id,
    username: user.username,
    prompt,
    theme,
    region,
    videoUrl: SAMPLE_VIDEOS[Math.floor(Math.random() * SAMPLE_VIDEOS.length)],
    thumbnailUrl: '',
    status: 'completed',
    duration: duration,
    likes: 0,
    views: 0,
    createdAt: new Date()
  };
  videos.set(id, video);
  return video;
};

exports.getVideos = ({ page = 1, limit = 12, theme, region, sort = 'newest' }) => {
  let result = Array.from(videos.values());
  
  if (theme) {
    result = result.filter(v => v.theme === theme);
  }
  if (region) {
    result = result.filter(v => v.region === region);
  }
  
  if (sort === 'popular') {
    result.sort((a, b) => b.likes - a.likes);
  } else {
    result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }
  
  const start = (page - 1) * limit;
  const paginated = result.slice(start, start + limit);
  
  return {
    videos: paginated,
    total: result.length,
    page,
    pages: Math.ceil(result.length / limit)
  };
};

exports.getVideoById = (id) => videos.get(id);
exports.deleteVideo = (id) => videos.delete(id);
exports.likeVideo = (id) => {
  const video = videos.get(id);
  if (video) {
    video.likes += 1;
    return video.likes;
  }
  return null;
};
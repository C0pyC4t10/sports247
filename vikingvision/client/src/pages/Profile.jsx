import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { videoService, userService } from '../services/api';
import './Profile.css';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('videos');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchUserVideos();
  }, [user]);

  const fetchUserVideos = async () => {
    try {
      const res = await videoService.getUserVideos();
      setVideos(res.data.videos);
    } catch (error) {
      console.error('Error fetching videos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteVideo = async (videoId) => {
    if (!confirm('Are you sure you want to delete this video?')) return;
    try {
      await videoService.deleteVideo(videoId);
      setVideos(videos.filter(v => v._id !== videoId));
    } catch (error) {
      alert('Failed to delete video');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) return null;

  return (
    <div className="profile-page">
      <div className="container">
        <div className="profile-header">
          <div className="profile-avatar">
            {user.username?.charAt(0).toUpperCase()}
          </div>
          <div className="profile-info">
            <h1>{user.username}</h1>
            <p>{user.email}</p>
          </div>
          <div className="profile-stats">
            <div className="stat-box">
              <span className="stat-value">{user.credits}</span>
              <span className="stat-label">Credits</span>
            </div>
            <div className="stat-box">
              <span className="stat-value">{videos.length}</span>
              <span className="stat-label">Videos</span>
            </div>
          </div>
        </div>

        <div className="profile-actions">
          <Link to="/generate" className="btn btn-primary">
            Generate New Video
          </Link>
          <button onClick={handleLogout} className="btn btn-secondary">
            Logout
          </button>
        </div>

        <div className="profile-tabs">
          <button 
            className={`tab-btn ${activeTab === 'videos' ? 'active' : ''}`}
            onClick={() => setActiveTab('videos')}
          >
            My Videos
          </button>
          <button 
            className={`tab-btn ${activeTab === 'favorites' ? 'active' : ''}`}
            onClick={() => setActiveTab('favorites')}
          >
            Favorites
          </button>
        </div>

        <div className="profile-content">
          {loading ? (
            <div className="loading">
              <div className="spinner large"></div>
            </div>
          ) : videos.length === 0 ? (
            <div className="empty-state">
              <p>You haven't generated any videos yet.</p>
              <Link to="/generate" className="btn btn-primary">
                Create Your First Video
              </Link>
            </div>
          ) : (
            <div className="videos-grid">
              {videos.map((video) => (
                <div key={video._id} className="video-card">
                  <div className="video-thumbnail">
                    <div className="play-overlay">▶</div>
                    {video.status === 'processing' && (
                      <div className="processing-badge">Processing</div>
                    )}
                  </div>
                  <div className="video-info">
                    <h3>{video.prompt.substring(0, 40)}...</h3>
                    <div className="video-meta">
                      <span className="video-theme">{video.theme}</span>
                      <span className="video-region">{video.region}</span>
                    </div>
                    <button 
                      onClick={() => handleDeleteVideo(video._id)}
                      className="delete-btn"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
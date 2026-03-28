import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { videoService } from '../services/api';
import './Home.css';

const Home = () => {
  const [themes, setThemes] = useState([]);
  const [regions, setRegions] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [themesRes, regionsRes, videosRes] = await Promise.all([
          videoService.getThemes(),
          videoService.getRegions(),
          videoService.getVideos({ limit: 8 })
        ]);
        setThemes(themesRes.data.themes);
        setRegions(regionsRes.data.regions);
        setVideos(videosRes.data.videos);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-bg">
          <div className="fog"></div>
          <div className="particles"></div>
        </div>
        <div className="hero-content">
          <h1 className="hero-title">
            Bring Viking History to <span className="highlight">Life</span>
          </h1>
          <p className="hero-subtitle">
            Generate stunning AI videos about Viking lifestyles, culture, and legends
          </p>
          <div className="hero-actions">
            <Link to="/generate" className="btn btn-primary btn-lg">
              Generate Your Video
            </Link>
            <Link to="/gallery" className="btn btn-secondary btn-lg">
              Explore Gallery
            </Link>
          </div>
          <div className="hero-stats">
            <div className="stat">
              <span className="stat-number">{themes.length}+</span>
              <span className="stat-label">Themes</span>
            </div>
            <div className="stat">
              <span className="stat-number">{regions.length}+</span>
              <span className="stat-label">Regions</span>
            </div>
            <div className="stat">
              <span className="stat-number">Free</span>
              <span className="stat-label">To Use</span>
            </div>
          </div>
        </div>
      </section>

      <section className="themes-section">
        <div className="container">
          <h2 className="section-title">Explore Themes</h2>
          <p className="section-subtitle">Choose a theme to inspire your video</p>
          <div className="themes-grid">
            {themes.map((theme, index) => (
              <Link to={`/generate?theme=${theme.key}`} key={theme.key} className="theme-card">
                <div className="theme-icon">{themeIcons[theme.key]}</div>
                <span className="theme-name">{theme.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="regions-section">
        <div className="container">
          <h2 className="section-title">Viking Regions</h2>
          <p className="section-subtitle">The lands where legends were born</p>
          <div className="regions-list">
            {regions.map((region) => (
              <Link to={`/gallery?region=${region}`} key={region} className="region-tag">
                {region}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="gallery-preview">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Latest Creations</h2>
            <Link to="/gallery" className="view-all">View All →</Link>
          </div>
          <div className="videos-grid">
            {videos.map((video) => (
              <div key={video._id} className="video-card">
                <div className="video-thumbnail">
                  <div className="play-overlay">▶</div>
                </div>
                <div className="video-info">
                  <h3 className="video-title">{video.prompt.substring(0, 50)}...</h3>
                  <div className="video-meta">
                    <span className="video-theme">{video.theme}</span>
                    <span className="video-region">{video.region}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container">
          <div className="cta-box">
            <h2>Ready to Create?</h2>
            <p>Start generating your own Viking-themed videos today</p>
            <Link to="/register" className="btn btn-primary btn-lg">Get Started Free</Link>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <span className="logo-icon">⚔️</span>
              <span className="logo-text">VikingVision</span>
            </div>
            <p>AI-Powered Viking Video Generator</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

const themeIcons = {
  mountains: '🏔️',
  snows: '❄️',
  wild: '🌿',
  forest: '🌲',
  life: '🏠',
  culture: '🎭',
  ocean: '🌊',
  rivers: '🌊',
  kingdoms: '🏰',
  native: '🛡️',
  countries: '🗺️'
};

export default Home;
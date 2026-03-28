import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { videoService } from '../services/api';
import './Generate.css';

const Generate = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [themes, setThemes] = useState([]);
  const [regions, setRegions] = useState([]);
  const [formData, setFormData] = useState({
    prompt: '',
    theme: searchParams.get('theme') || 'mountains',
    region: 'Norway',
    duration: parseInt(searchParams.get('duration')) || 10
  });
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [video, setVideo] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [themesRes, regionsRes] = await Promise.all([
          videoService.getThemes(),
          videoService.getRegions()
        ]);
        setThemes(themesRes.data.themes);
        setRegions(regionsRes.data.regions);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const promptParam = searchParams.get('prompt');
    if (promptParam) {
      setFormData(prev => ({ ...prev, prompt: promptParam }));
    }
  }, [searchParams]);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!formData.prompt.trim()) return;
    
    setLoading(true);
    setGenerating(true);
    setVideo(null);

    try {
      const res = await videoService.generateVideo(formData);
      setVideo(res.data.video);
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to generate video');
    } finally {
      setLoading(false);
      setGenerating(false);
    }
  };

  return (
    <div className="generate-page">
      <div className="container">
        <div className="generate-header">
          <h1>Generate Video</h1>
          <p>Create AI-powered Viking lifestyle videos</p>
        </div>

        <div className="generate-content">
          <form onSubmit={handleGenerate} className="generate-form">
            <div className="form-section">
              <h3>Describe Your Vision</h3>
              <textarea
                name="prompt"
                value={formData.prompt}
                onChange={handleChange}
                placeholder="Describe the video you want to create... e.g., Viking warriors sailing through icy fjords at sunset"
                rows={4}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-section">
                <h3>Theme</h3>
                <select name="theme" value={formData.theme} onChange={handleChange}>
                  {themes.map((theme) => (
                    <option key={theme.key} value={theme.key}>{theme.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-section">
                <h3>Region</h3>
                <select name="region" value={formData.region} onChange={handleChange}>
                  {regions.map((region) => (
                    <option key={region} value={region}>{region}</option>
                  ))}
                </select>
              </div>

              <div className="form-section">
                <h3>Duration</h3>
                <select name="duration" value={formData.duration} onChange={handleChange}>
                  <option value={5}>5 seconds</option>
                  <option value={10}>10 seconds</option>
                  <option value={15}>15 seconds</option>
                  <option value={20}>20 seconds</option>
                </select>
              </div>
            </div>

            <div className="credits-info">
              <span className="credits-label">Your Credits:</span>
              <span className="credits-value">{user?.credits || 0}</span>
              <span className="credits-note">1 credit per video</span>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary btn-block btn-lg"
              disabled={loading || !formData.prompt.trim()}
            >
              {generating ? (
                <>
                  <span className="spinner"></span>
                  Generating...
                </>
              ) : (
                'Generate Video'
              )}
            </button>
          </form>

          {video && (
            <div className="video-result">
              <h3>Your Video is Ready!</h3>
              <div className="video-preview">
                <video controls src={video.videoUrl} />
              </div>
              <div className="video-actions">
                <a href={video.videoUrl} download className="btn btn-primary">
                  Download Video
                </a>
                <Link to="/gallery" className="btn btn-secondary">
                  View in Gallery
                </Link>
              </div>
            </div>
          )}
        </div>

        <div className="prompt-tips">
          <h3>✨ Prompt Tips</h3>
          <div className="tips-grid">
            <div className="tip-card">
              <span className="tip-icon">🏔️</span>
              <span className="tip-text">Include specific locations like fjords, forests, or villages</span>
            </div>
            <div className="tip-card">
              <span className="tip-icon">🌅</span>
              <span className="tip-text">Add time of day - dawn, sunset, or midnight sun</span>
            </div>
            <div className="tip-card">
              <span className="tip-icon">⚔️</span>
              <span className="tip-text">Describe activities - raiding, trading, farming, feasting</span>
            </div>
            <div className="tip-card">
              <span className="tip-icon">❄️</span>
              <span className="tip-text">Add weather elements - snow, fog, rain, storms</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Generate;
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { videoService } from '../services/api';
import './Gallery.css';

const Gallery = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [filters, setFilters] = useState({
    theme: searchParams.get('theme') || '',
    region: searchParams.get('region') || '',
    sort: 'newest'
  });

  useEffect(() => {
    fetchVideos();
  }, [filters, pagination.page]);

  const fetchVideos = async () => {
    setLoading(true);
    try {
      const res = await videoService.getVideos({
        page: pagination.page,
        limit: 12,
        theme: filters.theme || undefined,
        region: filters.region || undefined,
        sort: filters.sort
      });
      setVideos(res.data.videos);
      setPagination(res.data.pagination);
    } catch (error) {
      console.error('Error fetching videos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value });
    setPagination({ ...pagination, page: 1 });
    if (key === 'theme' || key === 'region') {
      setSearchParams({ ...Object.fromEntries(searchParams), [key]: value });
    }
  };

  const clearFilters = () => {
    setFilters({ theme: '', region: '', sort: 'newest' });
    setSearchParams({});
    setPagination({ ...pagination, page: 1 });
  };

  const themes = ['mountains', 'snows', 'wild', 'forest', 'life', 'culture', 'ocean', 'rivers', 'kingdoms', 'native', 'countries'];
  const regions = ['Norway', 'Denmark', 'Sweden', 'Iceland', 'Greenland', 'England', 'France', 'Russia', 'Italy', 'Ireland', 'Scotland'];

  return (
    <div className="gallery-page">
      <div className="container">
        <div className="gallery-header">
          <h1>Video Gallery</h1>
          <p>Explore AI-generated Viking lifestyle videos</p>
        </div>

        <div className="gallery-filters">
          <div className="filter-group">
            <label>Theme</label>
            <select 
              value={filters.theme} 
              onChange={(e) => handleFilterChange('theme', e.target.value)}
            >
              <option value="">All Themes</option>
              {themes.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
            </select>
          </div>

          <div className="filter-group">
            <label>Region</label>
            <select 
              value={filters.region} 
              onChange={(e) => handleFilterChange('region', e.target.value)}
            >
              <option value="">All Regions</option>
              {regions.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>

          <div className="filter-group">
            <label>Sort By</label>
            <select 
              value={filters.sort} 
              onChange={(e) => handleFilterChange('sort', e.target.value)}
            >
              <option value="newest">Newest First</option>
              <option value="popular">Most Popular</option>
            </select>
          </div>

          {(filters.theme || filters.region) && (
            <button onClick={clearFilters} className="btn btn-ghost clear-btn">
              Clear Filters
            </button>
          )}
        </div>

        {loading ? (
          <div className="loading">
            <div className="spinner large"></div>
            <p>Loading videos...</p>
          </div>
        ) : videos.length === 0 ? (
          <div className="no-results">
            <p>No videos found. Try adjusting your filters or generate some videos!</p>
          </div>
        ) : (
          <>
            <div className="gallery-grid">
              {videos.map((video) => (
                <div key={video._id} className="gallery-card">
                  <div className="card-thumbnail">
                    <div className="play-btn">▶</div>
                  </div>
                  <div className="card-content">
                    <h3 className="card-title">{video.prompt.substring(0, 60)}...</h3>
                    <div className="card-meta">
                      <span className="meta-tag theme">{video.theme}</span>
                      <span className="meta-tag region">{video.region}</span>
                    </div>
                    <div className="card-stats">
                      <span>👁️ {video.views}</span>
                      <span>❤️ {video.likes}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {pagination.pages > 1 && (
              <div className="pagination">
                <button 
                  className="btn btn-secondary"
                  disabled={pagination.page === 1}
                  onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
                >
                  Previous
                </button>
                <span className="page-info">
                  Page {pagination.page} of {pagination.pages}
                </span>
                <button 
                  className="btn btn-secondary"
                  disabled={pagination.page === pagination.pages}
                  onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Gallery;
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">⚔️</span>
          <span className="logo-text">VikingVision</span>
        </Link>

        <div className="navbar-links">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/gallery" className="nav-link">Gallery</Link>
          <Link to="/generate" className="nav-link">Generate</Link>
          <Link to="/prompts" className="nav-link">Prompts</Link>
        </div>

        <div className="navbar-auth">
          {user ? (
            <div className="user-menu">
              <Link to="/profile" className="user-profile">
                <span className="user-avatar">{user.username?.charAt(0).toUpperCase()}</span>
                <span className="user-name">{user.username}</span>
                <span className="user-credits">{user.credits} credits</span>
              </Link>
              <button onClick={handleLogout} className="btn btn-ghost">Logout</button>
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="btn btn-ghost">Login</Link>
              <Link to="/register" className="btn btn-primary">Sign Up</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const AuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      localStorage.setItem('token', token);
      window.location.href = '/';
    } else {
      navigate('/login');
    }
  }, [searchParams, navigate]);
  
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      background: '#0D0D0F',
      color: '#E8F4FF'
    }}>
      <div>
        <h2>Logging you in...</h2>
        <p>Please wait</p>
      </div>
    </div>
  );
};

export default AuthCallback;
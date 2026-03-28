import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({ username: 'Guest', credits: 100 });
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState('demo-token');

  const logout = () => {
    setUser({ username: 'Guest', credits: 100 });
    setToken('demo-token');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login: () => {}, register: () => {}, logout, token }}>
      {children}
    </AuthContext.Provider>
  );
};
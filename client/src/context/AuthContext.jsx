import { createContext, useContext, useState, useEffect } from 'react';
import { apiFetch, readJson } from '../lib/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  // Load saved auth state on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('tremoc_user');
    const savedToken = localStorage.getItem('tremoc_token');
    if (savedUser && savedToken) {
      try {
        const parsed = JSON.parse(savedUser);
        setUser(parsed);
        setIsAuthenticated(true);
      } catch (e) {
        localStorage.removeItem('tremoc_user');
        localStorage.removeItem('tremoc_token');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await apiFetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });
      const data = await readJson(response);
      
      if (!response.ok) throw new Error(data.message || 'Đăng nhập thất bại');

      setUser(data.user);
      setIsAuthenticated(true);
      localStorage.setItem('tremoc_user', JSON.stringify(data.user));
      localStorage.setItem('tremoc_token', data.token);
      setShowLoginModal(false);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const register = async (userData) => {
    try {
      const response = await apiFetch('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData)
      });
      const data = await readJson(response);

      if (!response.ok) throw new Error(data.message || 'Đăng ký thất bại');

      setUser(data.user);
      setIsAuthenticated(true);
      localStorage.setItem('tremoc_user', JSON.stringify(data.user));
      localStorage.setItem('tremoc_token', data.token);
      setShowRegisterModal(false);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('tremoc_user');
    localStorage.removeItem('tremoc_token');
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await apiFetch('/api/auth/profile', {
        method: 'PUT',
        body: JSON.stringify(profileData)
      });
      const data = await readJson(response);

      if (!response.ok) throw new Error(data.message || 'Cập nhật thông tin thất bại');

      setUser(data.user);
      localStorage.setItem('tremoc_user', JSON.stringify(data.user));
      localStorage.setItem('tremoc_token', data.token);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const openLogin = () => {
    setShowRegisterModal(false);
    setShowLoginModal(true);
  };

  const openRegister = () => {
    setShowLoginModal(false);
    setShowRegisterModal(true);
  };

  const closeModals = () => {
    setShowLoginModal(false);
    setShowRegisterModal(false);
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      loading,
      login,
      register,
      logout,
      updateProfile,
      showLoginModal,
      showRegisterModal,
      openLogin,
      openRegister,
      closeModals,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

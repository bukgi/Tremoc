import { useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Header from './Header';
import Footer from './Footer';
import LoginModal from '../auth/LoginModal';
import RegisterModal from '../auth/RegisterModal';

const Layout = () => {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && user?.role === 'Manager') {
      const allowedPaths = ['/manager', '/profile'];
      const isAllowed = allowedPaths.some(path => location.pathname.startsWith(path));
      if (!isAllowed) {
        navigate('/manager', { replace: true });
      }
    }
  }, [user, isAuthenticated, location.pathname, navigate]);

  const isManagerPage = location.pathname.startsWith('/manager');

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      {!isManagerPage && <Footer />}
      <LoginModal />
      <RegisterModal />
    </div>
  );
};

export default Layout;

import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ManagerRoute = ({ children }) => {
  const { isAuthenticated, user, loading, openLogin } = useAuth();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-forest"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    setTimeout(() => openLogin(), 100);
    return <Navigate to="/" replace />;
  }

  if (user?.role !== 'Manager') {
    // Redirect to home if user is logged in but is not a Manager
    alert('Bạn không có quyền truy cập vào khu vực quản lý.');
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ManagerRoute;

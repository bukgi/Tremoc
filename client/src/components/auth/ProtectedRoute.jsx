import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading, openLogin } = useAuth();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-forest"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Trigger login modal and redirect to home
    setTimeout(() => openLogin(), 100);
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;


import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  redirectPath?: string;
  children?: React.ReactNode;
}

const ProtectedRoute = ({ 
  redirectPath = '/login', 
  children 
}: ProtectedRouteProps) => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-lilac">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // For first login, redirect to password reset
  if (isAuthenticated && user?.isFirstLogin && location.pathname !== '/reset-password') {
    return <Navigate to="/reset-password" replace />;
  }

  // For incomplete profile after first login is complete, redirect to profile setup
  if (isAuthenticated && !user?.isFirstLogin && !user?.profileCompleted && 
      location.pathname !== '/profile-setup') {
    return <Navigate to="/profile-setup" replace />;
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated && location.pathname !== '/login') {
    return <Navigate to={redirectPath} replace />;
  }

  // If authenticated but trying to access login page, redirect to home
  if (isAuthenticated && location.pathname === '/login') {
    return <Navigate to="/" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;

import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

// Index page just redirects to the appropriate location
const Index = () => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated || !user) {
    return <Navigate to="/auth" replace />;
  }

  return <Navigate to={user.role === 'dealer' ? '/dealer' : '/contractor'} replace />;
};

export default Index;

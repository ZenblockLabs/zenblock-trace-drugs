
import { ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: string[];
  fallbackPath?: string;
}

export const ProtectedRoute = ({ 
  children, 
  requiredRole, 
  fallbackPath = '/login' 
}: ProtectedRouteProps) => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate(fallbackPath);
      return;
    }

    if (requiredRole && user?.email) {
      const userEmail = user.email.toLowerCase();
      const hasRequiredRole = requiredRole.some(role => 
        userEmail.includes(role.toLowerCase())
      );
      
      if (!hasRequiredRole) {
        navigate('/unauthorized');
        return;
      }
    }
  }, [isAuthenticated, user, requiredRole, navigate, fallbackPath]);

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (requiredRole && user?.email) {
    const userEmail = user.email.toLowerCase();
    const hasRequiredRole = requiredRole.some(role => 
      userEmail.includes(role.toLowerCase())
    );
    
    if (!hasRequiredRole) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
            <p>You don't have permission to access this page.</p>
          </div>
        </div>
      );
    }
  }

  return <>{children}</>;
};

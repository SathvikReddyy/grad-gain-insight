
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredUserType?: 'student' | 'college';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredUserType }) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      if (!loading) {
        if (!user) {
          console.log('No user found, redirecting to home');
          navigate('/', { replace: true });
          return;
        }

        if (requiredUserType) {
          try {
            const { data: profile } = await supabase
              .from('profiles')
              .select('user_type')
              .eq('id', user.id)
              .single();

            if (profile?.user_type !== requiredUserType) {
              console.log('User type mismatch, redirecting to home');
              navigate('/', { replace: true });
              return;
            }
          } catch (error) {
            console.error('Error checking user type:', error);
            navigate('/', { replace: true });
            return;
          }
        }
      }
    };

    checkAuth();
  }, [user, loading, navigate, requiredUserType]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return user ? <>{children}</> : null;
};

export default ProtectedRoute;

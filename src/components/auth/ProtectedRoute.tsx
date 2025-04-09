
import { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { MainLayout } from '@/components/layout/MainLayout';
import { toast } from '@/components/ui/use-toast';

interface ProtectedRouteProps {
  element: React.ReactNode;
  requiredRoles?: string[];
}

export const ProtectedRoute = ({ 
  element, 
  requiredRoles = [] 
}: ProtectedRouteProps) => {
  const { currentUser, isAuthenticated } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please sign in to access this page.",
        variant: "destructive",
      });
    } else if (
      requiredRoles.length > 0 && 
      currentUser && 
      !requiredRoles.includes(currentUser.role)
    ) {
      toast({
        title: "Access denied",
        description: "You don't have permission to access this page.",
        variant: "destructive",
      });
    }
  }, [isAuthenticated, currentUser, requiredRoles]);

  // Check if user is authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if user has required role
  if (
    requiredRoles.length > 0 &&
    currentUser &&
    !requiredRoles.includes(currentUser.role)
  ) {
    return <Navigate to="/dashboard" replace />;
  }

  // If everything is fine, render the protected component inside the layout
  return <MainLayout>{element}</MainLayout>;
};

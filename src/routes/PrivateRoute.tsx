import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/api/user/userQuery';

interface PrivateRouteProps {
  children: React.ReactElement;
}

export const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const { isLoggedIn, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  return children;
};

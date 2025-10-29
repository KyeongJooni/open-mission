import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/api/user/userQuery';

interface PublicRouteProps {
  children: React.ReactElement;
}

export const PublicRoute = ({ children }: PublicRouteProps) => {
  const { isLoggedIn, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  if (isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  return children;
};

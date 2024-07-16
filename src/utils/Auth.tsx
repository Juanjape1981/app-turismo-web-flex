import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../redux/store/hooks';
import { RootState } from '../redux/store/store';
import User from '../models/User';

interface AuthGuardProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children, allowedRoles }) => {
  const { userData, accessToken } = useAppSelector((state: RootState) => state.user);
  
  if (!accessToken) {
    return <Navigate to="/login" />;
  }

  const userRole = (userData as User).role;
  
  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};

export default AuthGuard;

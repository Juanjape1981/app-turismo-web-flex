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

console.log("data del usuario",userData,"token de acceso",accessToken);


  if (!accessToken) {
    // alert('Usuario no autorizado');
    return <Navigate to="/login" />;
  }
  
  const userRoles = (userData as User).roles? (userData as User).roles.map((role:any) => role.role_name):['']; 
  // Verificar si al menos uno de los roles del usuario está en los roles permitidos
  const hasAccess = userRoles.some((role:any) => allowedRoles.includes(role));
  
  if (!hasAccess) {

    return <Navigate to="/" />;
  }

  return <>{children}</>;
};

export default AuthGuard;
// src\components\common\PrivateRoute.js

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const PrivateRoute = ({ allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Carregando...</div>;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  allowedRoles.includes(user.role);
  if (allowedRoles) return <Outlet />;
  
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />; 
  }
};

export default PrivateRoute;
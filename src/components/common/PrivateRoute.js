// src\components\common\PrivateRoute.js

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const PrivateRoute = ({ allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Carregando...</div>;

  // Se não estiver logado, manda para o login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Se a rota exige roles específicos e o usuário não tem o role necessário
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />; 
    // Ou redirecione para o dashboard com um alerta
  }

  return <Outlet />;
};

export default PrivateRoute;
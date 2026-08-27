import React from 'react';
import { Navigate } from 'react-router-dom';

function AuthGuard({ children }) {
  const token = localStorage.getItem('rs_admin_token');

  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}

export default AuthGuard;
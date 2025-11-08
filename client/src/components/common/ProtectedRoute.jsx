import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { authType } = useContext(AuthContext);
  const location = useLocation();

  // Check if user is authenticated (either Firebase user or guest)
  const isAuthenticated = authType === 'user' || authType === 'guest';

  if (!isAuthenticated) {
    // Redirect to login with the attempted location
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
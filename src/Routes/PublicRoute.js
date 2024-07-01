import React from 'react';
import { Navigate } from 'react-router-dom';

const PublicRoute = ({ isLoggedIn, redirectTo = "/todos", children }) => {
  return isLoggedIn ? <Navigate to={redirectTo} /> : children;
};

export default PublicRoute;

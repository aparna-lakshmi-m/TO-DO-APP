import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ isLoggedIn, redirectTo = "/login", children }) => {
  return isLoggedIn ? children : <Navigate to={redirectTo} />;
};

export default PrivateRoute;

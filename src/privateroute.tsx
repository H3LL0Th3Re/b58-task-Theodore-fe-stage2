// import React from 'react';
// import { Navigate } from 'react-router-dom';
// import PrivateLayout from './pages/layout/PrivateRoute';

// interface PrivateRouteProps {
//     isAuthenticated: boolean;
// }

// const PrivateRoute: React.FC<PrivateRouteProps> = ({ isAuthenticated}) => {
//     return isAuthenticated ? <PrivateLayout /> : <Navigate to="/login" />;
// };

// export default PrivateRoute;


import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

interface PrivateRouteProps {
  isAuthenticated: boolean;
  children?: ReactNode; // Allow children to be passed
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ isAuthenticated, children }) => {
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

export default PrivateRoute;


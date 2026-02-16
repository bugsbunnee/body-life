import type React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

import useAuthStore from '../store/auth';

const PrivateRoute: React.FC = () => {
   const { auth } = useAuthStore();

   if (auth) {
      return <Outlet />;
   }

   return <Navigate to="/" />;
};

export default PrivateRoute;

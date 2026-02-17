import useAuthStore from '@/store/auth';

import { Navigate, Outlet } from 'react-router-dom';
import { APP_ROUTES } from '../utils/constants';

const PublicRoute = () => {
   const authStore = useAuthStore();

   if (authStore) {
      return <Navigate to={APP_ROUTES.DASHBOARD} />;
   }

   return <Outlet />;
};

export default PublicRoute;

import React from 'react';

import NavBar from '@/components/ui/navbar';
import useAuthStore from '@/store/auth';

import { Navigate, Outlet } from 'react-router-dom';
import { APP_ROUTES } from '@/utils/constants';

const Dashboard: React.FC = () => {
   const { auth } = useAuthStore();

   if (!auth) {
      return <Navigate to={APP_ROUTES.AUTH} />;
   }

   return (
      <div className="grid grid-cols-[20rem_1fr] w-screen h-dvh overflow-hidden">
         <NavBar />

         <div className="overflow-y-scroll max-h-dvh">
            <Outlet />
         </div>
      </div>
   );
};

export default Dashboard;

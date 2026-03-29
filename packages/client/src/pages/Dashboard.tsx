import React from 'react';

import ChatTrigger from '@/components/chat/chat-trigger';
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
      <div className="lg:grid lg:grid-cols-[20rem_1fr] w-screen h-screen overflow-hidden">
         <NavBar />

         <div className="overflow-y-scroll max-h-screen max-md:pb-16">
            <Outlet />

            <ChatTrigger />
         </div>
      </div>
   );
};

export default Dashboard;

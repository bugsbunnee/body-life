import type React from 'react';
import NavBar from '@/components/ui/navbar';

import { Outlet } from 'react-router-dom';

const Dashboard: React.FC = () => {
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

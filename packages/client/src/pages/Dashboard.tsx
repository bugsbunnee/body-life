import type React from 'react';
import NavBar from '@/components/ui/navbar';

import { Outlet } from 'react-router-dom';

const Dashboard: React.FC = () => {
   return (
      <div className="grid grid-cols-[20rem_1fr] w-screen h-dvh">
         <NavBar />

         <div className="">
            <Outlet />
         </div>
      </div>
   );
};

export default Dashboard;

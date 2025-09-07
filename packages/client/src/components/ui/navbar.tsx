import React from 'react';
import clsx from 'clsx';

import { useLocation, useNavigate } from 'react-router-dom';
import { CiLogout } from 'react-icons/ci';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { motion } from 'motion/react';

import { sections } from '@/utils/constants';
import logo from '@/assets/images/logo.jpeg';

const NavBar: React.FC = () => {
   const location = useLocation();
   const navigate = useNavigate();

   return (
      <div className="h-dvh bg-gray-light p-[3rem] flex flex-col border-r border-b-border">
         <img src={logo} alt="RCNLagos Island" className="w-[6.06rem] h-[3.56rem] object-contain" />

         <div className="mt-3 flex-1">
            {sections.map((section) => (
               <React.Fragment key={section.label + section.path}>
                  <div className="text-lg font-medium uppercase text-gray-500 tracking-wide mt-[3.75rem]">{section.label}</div>

                  <ul className="mt-[2rem]">
                     {section.subroutes.map((route) => (
                        <motion.li
                           onClick={() => navigate(route.path)}
                           key={route.path}
                           whileHover={{ scale: 1.1 }}
                           transition={{
                              duration: 0.3,
                              ease: [0, 0.71, 0.2, 1.01],
                           }}
                           className={clsx({
                              'rounded-lg flex items-center gap-x-4 py-[0.75rem] px-[1.31rem] mb-8 text-lg font-medium': true,
                              'bg-blue-light text-main border border-[rgba(2, 42, 104, 0.05)]': location.pathname === route.path,
                              'text-gray-500': location.pathname !== route.path,
                           })}
                        >
                           <route.Icon fontSize="1.25rem" />
                           <div>{route.label}</div>
                        </motion.li>
                     ))}
                  </ul>
               </React.Fragment>
            ))}

            <button className="rounded-lg flex items-center gap-x-4 py-[0.75rem] px-[1.31rem] mb-8 text-lg font-medium text-red-500">
               <CiLogout fontSize="1.25rem" />
               <div>Logout</div>
            </button>
         </div>

         <div className="flex items-center justify-start gap-x-4">
            <Avatar className="w-[3rem] h-[3rem]">
               <AvatarImage src="https://github.com/shadcn.png" />
               <AvatarFallback>CN</AvatarFallback>
            </Avatar>

            <div>
               <div className="text-lg text-main font-medium">Chukwuma Marcel</div>
               <div className="text-sm text-gray-400 font-medium">Media HOD</div>
            </div>
         </div>
      </div>
   );
};

export default NavBar;

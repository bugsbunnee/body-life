import React, { useState } from 'react';
import Role from '../common/role';

import clsx from 'clsx';

import type { SubRoute } from '@/utils/entities';
import { useLocation, useNavigate } from 'react-router-dom';
import { CiLogout } from 'react-icons/ci';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronDownIcon } from 'lucide-react';

import { APP_ROUTES, sections } from '@/utils/constants';
import { getInitials } from '@/lib/utils';

import useAuthStore from '@/store/auth';
import logo from '@/assets/images/logo.jpeg';

const NavBar: React.FC = () => {
   const [expandedPathIndex, setExpandedPathIndex] = useState(-1);

   const authStore = useAuthStore();
   const location = useLocation();
   const navigate = useNavigate();

   const handleRouteClick = (route: SubRoute, index: number) => {
      if (route.subroutes.length > 0) {
         return setExpandedPathIndex((previous) => (previous === index ? -1 : index));
      }

      navigate(route.path);
   };

   const handleLogout = () => {
      authStore.logout();
      navigate(APP_ROUTES.AUTH);
   };

   return (
      <div className="h-dvh bg-gray-light overflow-y-auto p-8 flex flex-col border-r border-b-border">
         <img src={logo} alt="RCNLagos Island" className="w-[6.06rem] h-[3.56rem] object-contain" />

         <div className="mt-3 flex-1">
            {sections.map((section) => (
               <React.Fragment key={section.label + section.path}>
                  <ul className="mt-[2rem]">
                     {section.subroutes.map((route, index) => (
                        <React.Fragment key={route.label}>
                           <motion.li
                              onClick={() => handleRouteClick(route, index)}
                              key={route.path}
                              whileHover={{ scale: 1.1 }}
                              transition={{ duration: 0.3, ease: [0, 0.71, 0.2, 1.01] }}
                              className={clsx({
                                 'rounded-xl flex items-center gap-x-4 p-4 mb-4 text-sm uppercase tracking-wide font-medium': true,
                                 'bg-blue-light text-main border border-[rgba(2, 42, 104, 0.05)]':
                                    route.subroutes.length > 0 ? route.subroutes.map((sub) => sub.path).includes(location.pathname) : location.pathname === route.path,
                                 'text-gray-500': location.pathname !== route.path,
                              })}
                           >
                              <route.Icon fontSize="1.25rem" />
                              <div className="flex-1">{route.label}</div>
                              {route.subroutes.length > 0 && (
                                 <motion.div animate={{ rotate: index === expandedPathIndex ? 180 : 0 }} transition={{ duration: 0.2 }}>
                                    <ChevronDownIcon className="size-4" />
                                 </motion.div>
                              )}
                           </motion.li>

                           <AnimatePresence initial={false}>
                              {route.subroutes.length > 0 && index === expandedPathIndex && (
                                 <motion.ul
                                    key="subroutes"
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                                    className="overflow-hidden pl-6 mb-4"
                                 >
                                    {route.subroutes.map((subroute) => (
                                       <motion.li
                                          key={subroute.path}
                                          onClick={() => navigate(subroute.path)}
                                          whileHover={{ scale: 1.05 }}
                                          transition={{ duration: 0.2 }}
                                          className={clsx({
                                             'rounded-xl flex items-center gap-x-4 p-3 mb-4 text-sm uppercase tracking-wide font-medium cursor-pointer': true,
                                             'bg-blue-light text-main border border-[rgba(2,42,104,0.05)]': location.pathname === subroute.path,
                                             'text-gray-400': location.pathname !== subroute.path,
                                          })}
                                       >
                                          <subroute.Icon fontSize="1rem" />
                                          <div className="flex-1">{subroute.label}</div>
                                       </motion.li>
                                    ))}
                                 </motion.ul>
                              )}
                           </AnimatePresence>
                        </React.Fragment>
                     ))}
                  </ul>
               </React.Fragment>
            ))}

            <button onClick={handleLogout} className="rounded-xl flex items-center gap-x-4 py-[0.75rem] px-[1.31rem] mb-8 text-sm uppercase font-medium text-red-500">
               <CiLogout fontSize="1.25rem" />
               <div>Logout</div>
            </button>
         </div>

         {authStore.auth && (
            <div className="flex items-center justify-start gap-x-4">
               <Avatar className="w-[3rem] h-[3rem]">
                  <AvatarImage src={authStore.auth.admin.imageUrl} />
                  <AvatarFallback>{getInitials(authStore.auth.admin.firstName + ' ' + authStore.auth.admin.lastName)}</AvatarFallback>
               </Avatar>

               <div>
                  <div className="text-lg text-main font-medium">
                     {authStore.auth.admin.firstName} {authStore.auth.admin.lastName}
                  </div>

                  <div className="text-sm text-gray-neutral capitalize font-medium">
                     <Role role={authStore.auth.admin.userRole} />
                  </div>
               </div>
            </div>
         )}
      </div>
   );
};

export default NavBar;

import React, { useCallback, useState } from 'react';
import Role from '../common/role';

import type { RouteItem, SubRoute } from '@/utils/entities';

import { ChevronDownIcon, MenuIcon } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { sections } from '@/utils/constants';
import { LiaTimesSolid } from 'react-icons/lia';
import { useLocation, useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn, getInitials } from '@/lib/utils';
import { Drawer, DrawerContent, DrawerFooter, DrawerHeader } from '@/components/ui/drawer';

import useAuthStore from '@/store/auth';
import logo from '@/assets/images/logo.jpeg';

const NavBarMobile: React.FC = () => {
   const [isOpen, setOpen] = useState(false);
   const [expandedPathIndex, setExpandedPathIndex] = useState(-1);

   const handleToggleOpen = useCallback(() => {
      setOpen((previous) => !previous);
   }, []);

   const handleRouteClick = (route: SubRoute, index: number) => {
      if (route.subroutes.length > 0) {
         return setExpandedPathIndex((previous) => (previous === index ? -1 : index));
      }

      handleToggleOpen();

      navigate(route.path);
   };

   const handleSubRouteClick = (route: RouteItem) => {
      handleToggleOpen();
      navigate(route.path);
   };

   const authStore = useAuthStore();
   const location = useLocation();
   const navigate = useNavigate();

   return (
      <React.Fragment>
         <div className="lg:hidden block">
            <div className="flex items-center w-screen justify-between h-20 px-6 border-b border-b-gray-100 bg-background sticky top-0">
               <button onClick={handleToggleOpen}>
                  <MenuIcon className="text-main" />
               </button>

               {authStore.auth && (
                  <Avatar>
                     <AvatarFallback className="w-8 h-8 text-xs font-bold bg-main text-white">CM</AvatarFallback>
                  </Avatar>
               )}
            </div>

            <div>
               <Drawer direction="left" open={isOpen} onOpenChange={setOpen}>
                  <DrawerContent>
                     <DrawerHeader>
                        <div className="w-full flex justify-between items-center">
                           <div className="flex justify-between items-center">
                              <img src={logo} alt="Spartan Legal" className="w-[5.875rem] h-11 object-contain" />
                           </div>

                           <button onClick={handleToggleOpen} className="bg-blue-light w-10 h-10 rounded-full flex items-center justify-center text-base text-main border-0">
                              <LiaTimesSolid />
                           </button>
                        </div>
                     </DrawerHeader>

                     <div className="no-scrollbar overflow-y-auto px-4">
                        <div className="mt-8 flex-1">
                           <div className="px-4 text-xs tracking-wider font-semibold uppercase text-gray-600">Sections</div>

                           {sections.map((section) => (
                              <React.Fragment key={section.label + section.path}>
                                 <ul className="mt-4">
                                    {section.subroutes.map((route, index) => (
                                       <React.Fragment key={route.label}>
                                          <motion.li
                                             onClick={() => handleRouteClick(route, index)}
                                             key={route.path}
                                             whileHover={{ scale: 1.1 }}
                                             transition={{ duration: 0.3, ease: [0, 0.71, 0.2, 1.01] }}
                                             className={cn({
                                                'rounded-xl flex items-center gap-x-4 p-4 mb-2 text-md capitalize': true,
                                                'bg-blue-light text-main font-bold':
                                                   route.subroutes.length > 0
                                                      ? route.subroutes.map((sub) => sub.path).includes(location.pathname)
                                                      : location.pathname === route.path,
                                                'text-gray-800': location.pathname !== route.path,
                                             })}
                                          >
                                             <route.Icon fontSize="1.25rem" />

                                             <div className="flex-1">{route.label}</div>

                                             {route.subroutes.length > 0 && (
                                                <motion.div animate={{ rotate: index === expandedPathIndex ? 0 : -90 }} transition={{ duration: 0.2 }}>
                                                   <ChevronDownIcon className="size-5" />
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
                                                         onClick={() => handleSubRouteClick(subroute)}
                                                         whileHover={{ scale: 1.05 }}
                                                         transition={{ duration: 0.2 }}
                                                         className={cn({
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
                        </div>
                     </div>

                     <DrawerFooter>
                        {authStore.auth && (
                           <div className="flex items-center justify-start gap-x-4">
                              <Avatar className="w-[3rem] h-[3rem]">
                                 <AvatarImage src={authStore.auth.admin.imageUrl} />
                                 <AvatarFallback>{getInitials(authStore.auth.admin.firstName + ' ' + authStore.auth.admin.lastName)}</AvatarFallback>
                              </Avatar>

                              <div>
                                 <div className="text-md text-main font-medium">
                                    {authStore.auth.admin.firstName} {authStore.auth.admin.lastName}
                                 </div>

                                 <div className="text-xs text-gray-neutral capitalize font-medium">
                                    <Role role={authStore.auth.admin.userRole} />
                                 </div>
                              </div>
                           </div>
                        )}
                     </DrawerFooter>
                  </DrawerContent>
               </Drawer>
            </div>
         </div>
      </React.Fragment>
   );
};

export default NavBarMobile;

import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';

import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from '../ui/navigation-menu';
import { sections } from '../../utils/constants';

import Conditional from '../common/conditional';

const Menu: React.FC = () => {
   return (
      <NavigationMenu className="h-14 px-6">
         <NavigationMenuList>
            {sections.map((route) => (
               <Fragment key={route.label}>
                  <Conditional visible={route.subroutes.length > 0}>
                     <NavigationMenuItem className="hover:rounded-xl overflow-hidden rounded-xl">
                        <NavigationMenuTrigger className="text-sm font-bold bg-transparent rounded-xl capitalize">{route.label}</NavigationMenuTrigger>

                        <NavigationMenuContent className="z-50">
                           <div className="grid gap-2 grid-cols-[.65fr_1fr] w-[35rem] rounded-2xl">
                              <div className="h-full w-full p-6 border-r border-slate-200">
                                 <h2 className="text-dark text-xl tracking-wide font-bold text-left capitalize">{route.label}</h2>

                                 <ul className="list-none">
                                    {route.subroutes.map((route) => (
                                       <li key={route.path} className="mt-4">
                                          <NavigationMenuLink asChild>
                                             <Link to={route.path} className="text-slate-500 text-sm font-regular flex items-center gap-x-3 justify-start">
                                                <route.Icon /> <span>{route.label}</span>
                                             </Link>
                                          </NavigationMenuLink>
                                       </li>
                                    ))}
                                 </ul>
                              </div>

                              <div className="flex h-full w-full p-6">
                                 {/* <img src={route.image} alt={route.label} className="w-full h-full min-h-52 rounded-2xl object-cover" /> */}
                              </div>
                           </div>
                        </NavigationMenuContent>
                     </NavigationMenuItem>
                  </Conditional>

                  <Conditional visible={route.subroutes.length === 0}>
                     <div className="mr-8">
                        <Link to={route.path!} className="text-sm font-bold bg-transparent rounded-xl capitalize mr-6">
                           {route.label}
                        </Link>
                     </div>
                  </Conditional>
               </Fragment>
            ))}
         </NavigationMenuList>
      </NavigationMenu>
   );
};

export default Menu;

import React, { useCallback, useState } from 'react';
import Conditional from '../common/conditional';

import { Link, useNavigate } from 'react-router-dom';
import { FaChevronDown } from 'react-icons/fa6';
import { AnimatePresence, motion } from 'motion/react';

import type { Route, SubRoute } from '../../utils/entities';

interface Props {
   route: Route;
}

const MenuMobileItem: React.FC<Props> = ({ route }) => {
   const [isOpen, setOpen] = useState(false);

   const navigate = useNavigate();

   const handleToggleOpen = useCallback(
      (route: Route) => {
         if (route.subroutes.length > 0) setOpen((previous) => !previous);
         else navigate(route.path!);
      },
      [navigate]
   );

   return (
      <div className="w-full">
         <button
            onClick={() => handleToggleOpen(route)}
            className="w-full bg-transparent border-0 pt-3 pb-7 text-lg font-medium text-center capitalize flex justify-start items-center gap-x-2"
         >
            {route.label}

            <Conditional visible={route.subroutes.length > 0}>
               <motion.div variants={chevronAnimationVariants} initial="default" animate={isOpen ? 'rotate' : 'default'}>
                  <FaChevronDown />
               </motion.div>
            </Conditional>
         </button>

         <Conditional visible={route.subroutes.length > 0}>
            <AnimatePresence initial={false}>
               {isOpen && (
                  <motion.ul
                     key="content"
                     initial="collapsed"
                     animate="open"
                     exit="collapsed"
                     transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
                     variants={{
                        open: { opacity: 1, height: 'auto' },
                        collapsed: { opacity: 0, height: 0 },
                     }}
                  >
                     {route.subroutes.map((subroute: SubRoute) => (
                        <li key={subroute.label} className="mb-5">
                           <Link to={subroute.path} className="text-base font-regular gap-x-2 flex items-center justify-start">
                              <div className="text-alternative">{<subroute.Icon />}</div>
                              <span>{subroute.label}</span>
                           </Link>
                        </li>
                     ))}
                  </motion.ul>
               )}
            </AnimatePresence>
         </Conditional>
      </div>
   );
};

const chevronAnimationVariants = {
   rotate: {
      rotate: '180deg',
   },
   default: {
      rotate: '0deg',
   },
};

export default MenuMobileItem;

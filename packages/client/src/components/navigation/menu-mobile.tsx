import React, { useCallback, useState } from 'react';

import { AnimatePresence, motion } from 'motion/react';
import { TbMenu3 } from 'react-icons/tb';
import { LiaTimesSolid } from 'react-icons/lia';
import { sections } from '../../utils/constants';

import MenuMobileItem from './menu-mobile-item';
import logo from '../../assets/images/logo.png';

const MenuMobile: React.FC = () => {
   const [isOpen, setOpen] = useState(false);

   const handleToggleOpen = useCallback(() => {
      setOpen((previous) => !previous);
   }, []);

   return (
      <>
         <button onClick={handleToggleOpen} className="bg-main text-white rounded-lg w-10 h-10 flex items-center justify-center text-xl border-0">
            <TbMenu3 />
         </button>

         <AnimatePresence>
            {isOpen && (
               <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: screen.height }}
                  exit={{ height: 0 }}
                  transition={{ duration: 0.5 }}
                  className="bg-[#EDF2EE] py-10 z-50 px-8 fixed top-0 right-0 left-0 bottom-0 w-full"
               >
                  <div className="w-full flex justify-between items-center">
                     <div className="flex justify-between items-center">
                        <img src={logo} alt="Spartan Legal" className="w-[5.875rem] h-11 object-contain" />
                     </div>

                     <button onClick={handleToggleOpen} className="bg-transparent w-10 h-10 flex items-center justify-center text-3xl text-main border-0">
                        <LiaTimesSolid />
                     </button>
                  </div>

                  <div className="divide-y divide-[#CDCDCD] mt-10 w-full">
                     {sections.map((section) => (
                        <MenuMobileItem key={section.label} route={section} />
                     ))}
                  </div>
               </motion.div>
            )}
         </AnimatePresence>
      </>
   );
};

export default MenuMobile;

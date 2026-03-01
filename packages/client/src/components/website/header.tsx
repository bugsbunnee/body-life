import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Slider from 'react-slick';
import clsx from 'clsx';

import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { announcements } from '../../utils/data';
import { APP_ROUTES, FEATURES } from '../../utils/constants';

import Menu from '../navigation/menu';
import MenuMobile from '../navigation/menu-mobile';

import logoLight from '../../assets/images/logo.png';
import logoDark from '../../assets/images/logo.png';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

interface Props {
   mode?: 'light' | 'dark';
   logo?: 'light' | 'dark';
}

const Header: React.FC<Props> = ({ mode = 'light', logo = 'light' }) => {
   const [isScrolled, setScrolled] = useState(false);
   const [isAnnouncementVisible, setAnnouncementVisible] = useState(true);

   const handleScroll = useCallback(() => {
      const isScrolledNew = window.scrollY > 100;
      setScrolled(isScrolledNew);
   }, []);

   const logoVersion = useMemo(() => {
      if (isScrolled || logo === 'light') {
         return logoLight;
      }

      return logoDark;
   }, [logo, isScrolled]);

   useEffect(() => {
      window.addEventListener('scroll', handleScroll, { passive: true });

      return () => {
         window.removeEventListener('scroll', handleScroll);
      };
   }, [handleScroll]);

   useEffect(() => {
      if (FEATURES.HIDE_ANNOUNCEMENTS && isAnnouncementVisible) {
         const timeout = setTimeout(() => setAnnouncementVisible(false), 5_000);
         return () => clearTimeout(timeout);
      }
   }, [isAnnouncementVisible]);

   return (
      <div className="fixed top-0 z-50 overflow-hidden">
         <AnimatePresence>
            {isAnnouncementVisible && (
               <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="py-3 bg-orange-500">
                  <Slider slidesToScroll={1} speed={4000} slidesToShow={1} variableWidth cssEase="linear" autoplay autoplaySpeed={0}>
                     {announcements.map((announcement) => (
                        <div className="ml-2" key={announcement}>
                           <div className="flex items-center justify-center gap-x-2">
                              <div className="w-2 h-2 bg-white rounded-full"></div>
                              <div className="text-xs uppercase text-white font-regular tracking-widest text-center">{announcement}</div>
                           </div>
                        </div>
                     ))}
                  </Slider>
               </motion.div>
            )}
         </AnimatePresence>

         <div
            className={clsx({
               'flex justify-between items-center h-[7.31rem] w-screen px-5 lg:px-[5.375rem]': true,
               'bg-white border-b border-main': isScrolled,
            })}
         >
            <div>
               <Link to={APP_ROUTES.HOME}>
                  <img src={logoVersion} alt="Spartan Legal" className="w-52 h-20 object-contain" />
               </Link>
            </div>

            <div
               className={clsx({
                  'border-0 hidden lg:block rounded-xl': true,
                  'bg-white text-main': mode === 'light',
                  'bg-main text-white': mode === 'dark',
               })}
            >
               <Menu />
            </div>

            <div className="lg:hidden block">
               <MenuMobile />
            </div>
         </div>
      </div>
   );
};

export default Header;

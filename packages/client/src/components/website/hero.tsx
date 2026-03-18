import React, { useCallback, useEffect, useRef, useState } from 'react';
import { TypeAnimation } from 'react-type-animation';
import clsx from 'clsx';

import { FaArrowDownLong } from 'react-icons/fa6';
import { AnimatePresence, motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { MessageCircleIcon } from 'lucide-react';
import { Button } from '../ui/button';

import video from '../../assets/videos/video.mp4';
import welcome from '../../assets/videos/welcome.mp4';

const VIDEOS = [welcome, video];

interface Props {
   onScroll: () => void;
}

const Hero: React.FC<Props> = ({ onScroll }) => {
   const [currentIndex, setCurrentIndex] = useState(0);

   const videoRef = useRef<HTMLVideoElement>(null);
   const navigate = useNavigate();

   const handleVideoEnd = useCallback(() => {
      setCurrentIndex((previous) => (previous + 1) % VIDEOS.length);
   }, []);

   useEffect(() => {
      if (videoRef.current) {
         videoRef.current.play();
      }
   }, [currentIndex]);

   return (
      <div className="h-screen flex justify-center items-center w-full relative">
         <div className="w-full h-full bg-black/30 z-20 flex justify-center items-center absolute top-0 right-0 bottom-0 left-0"></div>

         <AnimatePresence mode="wait">
            <motion.video
               preload="auto"
               src={VIDEOS[currentIndex]}
               ref={videoRef}
               playsInline
               muted
               autoPlay
               onEnded={handleVideoEnd}
               className="absolute top-0 bottom-0 left-0 right-0 w-screen h-full object-cover z-10"
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               transition={{ duration: 1, ease: 'easeInOut' }}
            ></motion.video>
         </AnimatePresence>

         <div className="px-5 lg:px-0 max-w-[35rem] lg:max-w-[50rem] z-40 text-center text-white">
            <h1 className="font-bold text-4xl lg:text-7xl">
               <span>Welcome </span>

               <span className="text-orange-200">
                  <TypeAnimation sequence={['to RCNLagos Island Church.', 2000, 'Home.', 2000, 'to Family.']} wrapper="span" cursor={true} repeat={Infinity} />
               </span>
            </h1>

            <p className="font-normal text-sm lg:text-xl my-8">Striving for the rebirth of apostolic Christianity, preaching, praying and prophesying until revival comes.</p>

            <div className="flex items-center justify-center">
               <Button className="font-bold py-8 min-w-54 rounded-2xl text-xs uppercase bg-orange-500 text-white" onClick={() => navigate('')}>
                  <MessageCircleIcon />
                  Send us a message
               </Button>
            </div>
         </div>

         <div className="hidden lg:flex justify-end items-center absolute z-40 bottom-16 gap-x-4">
            {VIDEOS.map((_, index) => (
               <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={clsx({
                     'w-12 h-12 rounded-full border-3 text-base font-bold text-white ': true,
                     'opacity-30 border-orange-200': index !== currentIndex,
                     'border-orange-500': index === currentIndex,
                  })}
               >
                  {index + 1}
               </button>
            ))}
         </div>

         <motion.button
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 1 }}
            className="flex lg:hidden justify-center animate-bounce items-center absolute z-40 bottom-16 gap-x-4 w-11 h-11 rounded-full bg-main text-white text-base"
            onClick={onScroll}
         >
            <FaArrowDownLong />
         </motion.button>
      </div>
   );
};

export default Hero;

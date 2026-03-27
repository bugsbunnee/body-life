import React, { useState } from 'react';

import ChatBot from './chat-bot';
import Conditional from '../common/conditional';

import { ChevronDownIcon } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { HiChatAlt2 } from 'react-icons/hi';

const ChatTrigger = () => {
   const [isModalOpen, setModalOpen] = useState(false);

   return (
      <React.Fragment>
         <AnimatePresence>
            <Conditional visible={isModalOpen}>
               <motion.div
                  key="chatbot"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-black/30 w-full h-full fixed"
                  onClick={() => setModalOpen(false)}
               />

               <motion.div
                  initial={{ transform: 'translateY(100%)', opacity: 0, scale: 0 }}
                  animate={{ transform: 'translateY(0)', opacity: 1, scale: 1 }}
                  exit={{ transform: 'translateY(100%)', opacity: 0 }}
                  className="w-96 right-16 z-50 p-4 fixed bg-white border rounded-2xl bottom-32"
               >
                  <ChatBot />
               </motion.div>
            </Conditional>
         </AnimatePresence>

         <motion.button
            className="right-16 bottom-16 fixed bg-main w-12 h-12 text-2xl text-white flex items-center justify-center rounded-full "
            initial={{ scale: 0 }}
            whileHover={{ rotate: 360 }}
            whileTap={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            onClick={() => setModalOpen((previous) => !previous)}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
         >
            {isModalOpen ? <ChevronDownIcon /> : <HiChatAlt2 />}
         </motion.button>
      </React.Fragment>
   );
};

export default ChatTrigger;

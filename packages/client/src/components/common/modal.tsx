import type React from 'react';

import { AnimatePresence, motion } from 'motion/react';
import { IoIosClose } from 'react-icons/io';

interface Props extends React.PropsWithChildren {
   title: string;
   visible: boolean;
   onClose: () => void;
}

const Modal: React.FC<Props> = ({ children, onClose, title, visible }) => {
   return (
      <AnimatePresence mode="wait">
         {visible && (
            <motion.div className="w-screen h-screen fixed top-0 right-0 bottom-0 left-0 bg-black/80 z-50 flex items-end justify-center sm:items-center">
               <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 40 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 40 }}
                  className="w-full sm:w-[75%] lg:w-[55%] bg-white rounded-t-2xl sm:rounded-xl max-h-[95dvh] flex flex-col"
               >
                  <div className="text-white p-5 sm:p-9 flex items-start justify-between shrink-0">
                     <div className="text-sm font-medium capitalize bg-blue-light text-dark px-5 py-3.5 w-fit border border-border rounded-md">{title}</div>

                     <button onClick={() => onClose()} className="cursor-pointer w-9 h-9 flex items-center justify-center">
                        <IoIosClose className="text-dark" size={40} />
                     </button>
                  </div>

                  <div className="px-5 sm:px-9 pb-5 sm:pb-9 overflow-y-auto flex-1">{children}</div>
               </motion.div>
            </motion.div>
         )}
      </AnimatePresence>
   );
};

export default Modal;

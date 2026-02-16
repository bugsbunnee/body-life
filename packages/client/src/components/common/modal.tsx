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
            <motion.div className="w-screen h-screen fixed top-0 right-0 bottom-0 left-0 bg-black/80 z-50 flex items-center justify-center">
               <motion.div initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0 }} className="w-[55%] bg-white rounded-xl">
                  <div className="text-white p-9 flex items-start justify-between">
                     <div className="text-sm font-medium capitalize bg-blue-light text-dark px-5 py-3.5 w-fit border border-border rounded-md">{title}</div>

                     <div className="flex items-center justify-center gap-x-[1rem]">
                        <button onClick={() => onClose()} className="cursor-pointer w-[2.25rem] h-[2.25rem] flex items-center justify-center">
                           <IoIosClose className="text-dark" size={40} />
                        </button>
                     </div>
                  </div>

                  <div className="px-9 pb-9 overflow-y-auto max-h-[40rem]">{children}</div>
               </motion.div>
            </motion.div>
         )}
      </AnimatePresence>
   );
};

export default Modal;

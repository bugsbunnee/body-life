import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { motion } from 'motion/react';
import { AlertCircle, Check } from 'lucide-react';

import Conditional from '@/components/common/conditional';
import UnsubscribeNewsletterForm from '@/components/forms/newsletter/unsubscriber-newsletter-form';

import logo from '../assets/images/logo.png';

const UnsubscribePage: React.FC = () => {
   const [searchParams] = useSearchParams();
   const [isUnsubscribed, setUnsubscribed] = useState(false);

   return (
      <div className="grid grid-cols-2 bg-secondary h-screen">
         <div className="hidden bg-slate-50 lg:block h-screen">
            <div className="relative h-full w-full">
               <img src="/images/island.webp" alt="Body Life" className="h-full w-full object-cover" />
               <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 to-transparent flex flex-col justify-end p-12 text-white"></div>
            </div>
         </div>

         <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="w-full p-8 md:p-16 lg:p-20 flex flex-col justify-center relative z-10 bg-white h-screen"
         >
            <div className="my-12">
               <img src={logo} className="w-36 h-36 object-contain" />
            </div>

            <div className="w-full mx-auto md:mx-0">
               <Conditional visible={!isUnsubscribed}>
                  <UnsubscribeNewsletterForm userId={searchParams.get('id')!} onUnsubscribe={() => setUnsubscribed(true)} />
               </Conditional>

               <Conditional visible={isUnsubscribed}>
                  <motion.div
                     initial={{ opacity: 0, scale: 0.95 }}
                     animate={{ opacity: 1, scale: 1 }}
                     className="bg-white border border-slate-100 shadow-2xl shadow-slate-200/50 rounded-3xl p-10 text-center relative overflow-hidden"
                  >
                     <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 border border-amber-100 rounded-full text-amber-700 text-xs font-semibold mb-6 uppercase tracking-wider">
                        <AlertCircle className="w-3 h-3" /> Unsubscribed
                     </div>

                     <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-50 rounded-full blur-3xl opacity-60 pointer-events-none"></div>

                     <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm relative z-10 border border-emerald-100">
                        <Check className="w-10 h-10" />
                     </div>

                     <h2 className="text-3xl font-medium text-main mb-3 relative z-10">You've been unsubscribed!</h2>

                     <p className="text-slate-500 mb-8 relative z-10 font-light text-lg">
                        You have been unsubscribed from our newsletter. You will no longer receive weekly updates via email.
                     </p>
                  </motion.div>
               </Conditional>
            </div>
         </motion.div>
      </div>
   );
};

export default UnsubscribePage;

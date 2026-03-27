import type React from 'react';

import logo from '../assets/images/logo.png';

import AuthSlides from '@/components/layout/auth/slide';
import PasswordForm from '@/components/forms/auth/password-form';

const ResetPassword: React.FC = () => {
   return (
      <div className="grid grid-cols-2 bg-secondary">
         <div className="hidden bg-slate-50 lg:block">
            <AuthSlides />
         </div>

         <div className="bg-secondary h-screen">
            <div className="flex items-center justify-center mt-[8.06rem]">
               <img src={logo} className="w-[6.06rem] h-[3.56rem] object-contain" />
            </div>

            <div className="flex justify-center">
               <div className="w-full max-w-[32.5rem] bg-white mt-[9.5rem] rounded-xl p-[1.875rem]">
                  <h2 className="text-center text-dark font-bold text-2xl">Setup Password</h2>

                  <PasswordForm />
               </div>
            </div>
         </div>
      </div>
   );
};

export default ResetPassword;

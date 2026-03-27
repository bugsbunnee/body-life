import React from 'react';

import AuthSlides from '@/components/layout/auth/slide';
import ForgotPasswordForm from '@/components/forms/auth/forgot-password-form';

import logo from '../assets/images/logo.png';

const ForgotPassword: React.FC = () => {
   return (
      <div className="grid grid-cols-2 bg-secondary">
         <div className="hidden bg-slate-50 lg:block h-screen">
            <AuthSlides />
         </div>

         <div className="bg-secondary h-screen">
            <div className="flex items-center justify-center mt-[8.06rem]">
               <img src={logo} className="w-[6.06rem] h-[3.56rem] object-contain" />
            </div>

            <div className="flex justify-center">
               <div className="w-full max-w-[32.5rem] bg-white mt-[9.5rem] rounded-xl p-[1.875rem]">
                  <h2 className="text-center text-dark font-bold text-2xl">Forgot Password</h2>

                  <ForgotPasswordForm />
               </div>
            </div>
         </div>
      </div>
   );
};

export default ForgotPassword;

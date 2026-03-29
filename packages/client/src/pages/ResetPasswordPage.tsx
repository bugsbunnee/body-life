import type React from 'react';

import logo from '../assets/images/logo.png';

import AuthSlides from '@/components/layout/auth/slide';
import PasswordForm from '@/components/forms/auth/password-form';

const ResetPassword: React.FC = () => {
   return (
      <div className="lg:grid lg:grid-cols-2 bg-secondary">
         <div className="hidden lg:block h-screen relative overflow-hidden">
            <AuthSlides />
         </div>

         <div className="bg-secondary h-dvh p-6 sm:p-8 lg:h-screen overflow-y-auto flex items-center justify-center">
            <div className="w-full max-w-lg">
               <div className="flex items-center justify-center">
                  <img src={logo} className="w-[6.06rem] h-[3.56rem] object-contain" alt="Logo" />
               </div>

               <div className="bg-white mt-8 sm:mt-16 lg:mt-20 rounded-xl p-6 sm:p-[1.875rem]">
                  <h2 className="text-center text-dark font-bold text-2xl">Admin Sign in</h2>
                  <PasswordForm />
               </div>
            </div>
         </div>
      </div>
   );
};

export default ResetPassword;

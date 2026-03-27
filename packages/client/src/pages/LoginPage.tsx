import React from 'react';

import AuthSlides from '@/components/layout/auth/slide';
import LoginForm from '@/components/forms/auth/login-form';

import logo from '../assets/images/logo.png';

const LoginPage: React.FC = () => {
   return (
      <div className="grid grid-cols-2 bg-secondary">
         <div className="hidden lg:block h-screen relative overflow-hidden">
            <AuthSlides />
         </div>

         <div className="bg-secondary h-screen overflow-y-auto">
            <div className="flex items-center justify-center mt-[8.06rem]">
               <img src={logo} className="w-[6.06rem] h-[3.56rem] object-contain" alt="Logo" />
            </div>

            <div className="flex justify-center">
               <div className="w-full max-w-[32.5rem] bg-white mt-[9.5rem] rounded-xl p-[1.875rem]">
                  <h2 className="text-center text-dark font-bold text-2xl">Admin Sign in</h2>
                  <LoginForm />
               </div>
            </div>
         </div>
      </div>
   );
};

export default LoginPage;

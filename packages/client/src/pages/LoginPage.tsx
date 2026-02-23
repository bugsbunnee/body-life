import type React from 'react';

import logo from '../assets/images/logo.png';
import LoginForm from '@/components/forms/auth/login-form';

const LoginPage: React.FC = () => {
   return (
      <div className="grid grid-cols-2 bg-secondary">
         <div className="hidden bg-slate-50 lg:block h-screen">
            <div className="relative h-full w-full">
               <img src="/images/island.webp" alt="Body Life" className="h-full w-full object-cover" />
               <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 to-transparent flex flex-col justify-end p-12 text-white">
                  <h2 className="mb-4 text-4xl font-bold">Welcome to Body Life</h2>
                  <p className="text-lg text-blue-100">
                     Our mandate is to strive for the rebirth of apostolic Christianity across the nations by raising a people of prayer, sound doctrine, and kingdom service.
                  </p>
               </div>
            </div>
         </div>

         <div className="bg-secondary h-screen">
            <div className="flex items-center justify-center mt-[8.06rem]">
               <img src={logo} className="w-[6.06rem] h-[3.56rem] object-contain" />
            </div>

            <div className="flex justify-center">
               <div className="w-full max-w-[32.5rem] bg-white mt-[9.5rem] rounded-lg p-[1.875rem]">
                  <h2 className="text-center text-dark font-bold text-2xl">Admin Sign in</h2>

                  <LoginForm />
               </div>
            </div>
         </div>
      </div>
   );
};

export default LoginPage;

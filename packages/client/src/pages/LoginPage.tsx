import type React from 'react';
import logo from '../assets/images/logo.jpeg';

const LoginPage: React.FC = () => {
   return (
      <div className="grid grid-cols-2">
         <div></div>
         <div className="bg-secondary h-screen">
            <div className="flex items-center justify-center mt-[8.06rem]">
               <img src={logo} className="w-[6.06rem] h-[3.56rem] object-contain" />
            </div>

            <div className="flex justify-center">
               <div className="w-full max-w-[32.5rem] bg-white mt-[9.5rem] rounded-lg p-[1.875rem]">
                  <h2 className="text-center text-dark font-bold text-2xl">Admin Sign in</h2>
               </div>
            </div>
         </div>
      </div>
   );
};

export default LoginPage;

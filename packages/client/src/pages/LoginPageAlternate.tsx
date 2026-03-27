import React from 'react';
import LoginForm from '@/components/forms/auth/login-form';

import logo from '../assets/images/logo.png';
import Slider from 'react-slick';

const LoginPage: React.FC = () => {
   return (
      <div className="grid grid-cols-2 bg-secondary">
         <div className="hidden bg-slate-50 lg:block h-screen">
            <Slider {...{ dots: true, infinite: true, speed: 500, slidesToShow: 1, slidesToScroll: 1 }}>
               <div className="relative h-screen w-full">
                  <img src="/images/island.webp" alt="Body Life" className="h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t bg-black/60 flex flex-col justify-end p-4 text-white">
                     <div className="p-8  rounded-xl  bg-main/40">
                        <h2 className="mb-2 text-4xl font-bold">Welcome to Body Life</h2>
                        <p className="text-lg text-blue-100 max-w-xl">
                           Our mandate is to strive for the rebirth of apostolic Christianity across the nations by raising a people of prayer, sound doctrine, and kingdom service.
                        </p>
                     </div>
                  </div>
               </div>
               <div className="relative h-screen w-full">
                  <img src="/images/bg.jpg" alt="Body Life" className="h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t bg-black/60 flex flex-col justify-end p-4 text-white">
                     <div className="p-8  rounded-xl  bg-main/40">
                        <h2 className="mb-2 text-4xl font-bold">Welcome to Body Life</h2>
                        <p className="text-lg text-blue-100 max-w-xl">
                           Our mandate is to strive for the rebirth of apostolic Christianity across the nations by raising a people of prayer, sound doctrine, and kingdom service.
                        </p>
                     </div>
                  </div>
               </div>
               <div>
                  <h3>2</h3>
               </div>
               <div>
                  <h3>3</h3>
               </div>
               <div>
                  <h3>4</h3>
               </div>
               <div>
                  <h3>5</h3>
               </div>
               <div>
                  <h3>6</h3>
               </div>
            </Slider>
         </div>

         <div className="bg-secondary h-screen">
            <div className="flex items-center justify-center mt-[8.06rem]">
               <img src={logo} className="w-[6.06rem] h-[3.56rem] object-contain" />
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

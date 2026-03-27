import React, { useState } from 'react';
import Slider, { type Settings } from 'react-slick';

import { slides } from '@/utils/data';
import { cn } from '@/lib/utils';

import SlideCounter from '@/components/common/slide-counter';

const AuthSlides: React.FC = () => {
   const [currentSlide, setCurrentSlide] = useState(-1);

   const sliderSettings: Settings = {
      dots: true,
      infinite: true,
      speed: 800,
      slidesToShow: 1,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 4000,
      pauseOnHover: false,
      cssEase: 'ease-in-out',
      arrows: false,
      afterChange: (currentSlide) => setCurrentSlide(currentSlide),
      appendDots: (dots: React.ReactNode) => (
         <div
            style={{
               position: 'absolute',
               bottom: '2rem',
               left: '90%',
               transform: 'translateX(-50%)',
               zIndex: 10,
            }}
         >
            <ul className="flex gap-2 m-0 p-0">{dots}</ul>
         </div>
      ),
      customPaging: (index) => (
         <div
            className={cn({
               'h-2 rounded-full transition-all duration-300 cursor-pointer': true,
               'bg-white w-6': currentSlide === index,
               'bg-white/50 w-2': currentSlide !== index,
            })}
         />
      ),
   };

   return (
      <React.Fragment>
         <Slider {...sliderSettings} className="h-full">
            {slides.map((slide, index) => (
               <div key={index} className="relative h-screen w-full outline-none">
                  <img src={slide.image} alt={slide.alt} className="h-screen w-full object-cover" style={{ height: '100vh' }} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-4 text-white">
                     <div className="backdrop-blur-lg p-8 rounded-xl bg-white/10 mb-22 mx-4 transition-all duration-500">
                        <h2 className="mb-3 text-4xl font-bold leading-tight">{slide.title}</h2>
                        <p className="text-lg text-blue-100 max-w-xl leading-relaxed">{slide.description}</p>
                     </div>
                  </div>
               </div>
            ))}
         </Slider>

         <div className="absolute top-6 right-6 z-10 bg-black/30 backdrop-blur-sm text-white text-sm px-3 py-1 rounded-full">
            <SlideCounter total={slides.length} />
         </div>
      </React.Fragment>
   );
};

export default AuthSlides;

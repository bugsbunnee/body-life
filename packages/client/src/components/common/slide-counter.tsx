import React, { useEffect, useState } from 'react';

interface Props {
   total: number;
}

const SlideCounter: React.FC<Props> = ({ total }) => {
   const [current, setCurrent] = useState(1);

   useEffect(() => {
      const interval = setInterval(() => {
         const activeSlide = document.querySelector('.slick-active[data-index]');

         if (activeSlide) {
            const index = parseInt(activeSlide.getAttribute('data-index') || '0', 10);
            setCurrent(index + 1);
         }
      }, 500);

      return () => clearInterval(interval);
   }, []);

   return (
      <span>
         {current} / {total}
      </span>
   );
};

export default SlideCounter;

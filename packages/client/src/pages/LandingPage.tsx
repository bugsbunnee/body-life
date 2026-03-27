import type React from 'react';

import { Button } from '@/components/ui/button';

import ChatTrigger from '@/components/chat/chat-trigger';
import Header from '@/components/website/header';
import Hero from '@/components/website/hero';

const LandingPage: React.FC = () => {
   return (
      <div className="h-full w-screen">
         <Header />

         <Hero onScroll={() => {}} />

         <div className="bg-gray-50 p-20 w-screen overflow-hidden">
            <div className="rounded-xl grid grid-cols-[2fr_1fr] overflow-hidden">
               <div className="">
                  <img src="/images/hods.png" className="w-full h-full object-cover" />
               </div>

               <div className="p-12 bg-white">
                  <div className="text-sm text-orange-500 font-medium tracking-wider">ABOUT RCNLAGOS ISLAND CHURCH</div>

                  <h2 className="text-4xl font-semibold mt-4">Remnant Christian Network Lagos Island Church</h2>

                  <p className="mt-8 text-gray-neutral text-base">
                     RCNLagos Island Church is the Lagos Island expression of Remnant Christian Network Lagos. Planted with the same vision and heartbeat, the RCNLagos Island
                     Church is a thriving family of believers passionate about prayer, the word, and fellowship.
                  </p>

                  <p className="mt-4 text-gray-neutral text-base ">
                     Located in the heart of Lekki, the Island Church serves as a hub for equipping, refreshing, and mobilising God’s people for kingdom impact.
                  </p>

                  <p className="mt-4 text-gray-neutral text-base ">
                     It’s more than a church; it’s a family where believers are strengthened, aligned, and sent out to live out apostolic Christianity in their everyday lives.
                  </p>

                  <Button className="mt-8 bg-orange-500 px-9 py-6">Learn More</Button>
               </div>
            </div>
         </div>

         <ChatTrigger />
      </div>
   );
};

export default LandingPage;

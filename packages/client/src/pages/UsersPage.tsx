import type React from 'react';
import Header from '@/components/common/header';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DatePickerDemo } from '@/components/ui/datepicker';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';
import Filters from '@/components/common/filters';

const UsersPage: React.FC = () => {
   return (
      <>
         <Header title="Members" />

         <div className="pt-8">
            <Tabs defaultValue="account" className="w-full">
               <TabsList className="w-full bg-transparent border-b-border border-b justify-start">
                  <TabsTrigger
                     className="max-w-fit p-4 text-base text-gray-500 font-medium data-[state=active]:shadow-none data-[state=active]:rounded-none data-[state=active]:text-main data-[state=active]:bg-blue-light data-[state=active]:border-b-main"
                     value="workforce"
                  >
                     Workforce
                  </TabsTrigger>
                  <TabsTrigger
                     className="max-w-fit p-4 text-base text-gray-500 font-medium data-[state=active]:shadow-none data-[state=active]:rounded-none data-[state=active]:text-main data-[state=active]:bg-blue-light data-[state=active]:border-b-main"
                     value="non-workforce"
                  >
                     Non-Workforce
                  </TabsTrigger>
               </TabsList>

               <div className="p-6 border-b-border border-b flex items-center justify-between">
                  <div className="">
                     <div className="text-base text-black font-semibold">Members Chart</div>
                     <div className="text-base text-gray-400 mt-[0.25rem]">Track the activities of your members</div>
                  </div>

                  <div className="flex gap-x-4">
                     <DatePickerDemo />

                     <Button
                        variant="ghost"
                        className="bg-main data-[empty=true]:bg-blue-light px-9 h-12 rounded-md justify-start text-left font-medium text-base text-white"
                     >
                        <PlusIcon />
                        <span className="flex-1">Add New</span>
                     </Button>
                  </div>
               </div>

               <Filters />

               <TabsContent value="account">Make changes to your account here.</TabsContent>
               <TabsContent value="password">Change your password here.</TabsContent>
            </Tabs>
         </div>
      </>
   );
};

export default UsersPage;

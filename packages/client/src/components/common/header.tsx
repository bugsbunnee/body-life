import React, { useRef } from 'react';
import { SearchIcon } from 'lucide-react';

interface Props {
   title: string;
   onSearch: (search: string) => void;
}

const Header: React.FC<Props> = ({ title, onSearch }) => {
   const ref = useRef<HTMLInputElement>(null);

   const handleSubmitForm = (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (ref.current) {
         onSearch(ref.current.value);
      }
   };

   return (
      <header className="px-4 md:px-6 pt-8 md:pt-[3.375rem] pb-5 md:pb-[1.875rem] flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-b-border">
         <h1 className="text-2xl text-main font-medium">{title}</h1>

         <div className="w-full sm:w-auto">
            <form onSubmit={handleSubmitForm}>
               <div className="border border-gray-200 rounded-2xl h-14 px-4 w-full sm:min-w-[16rem] flex justify-start items-center gap-x-3">
                  <SearchIcon className="size-5 text-[#BEBEBE] shrink-0" />

                  <input
                     ref={ref}
                     type="text"
                     placeholder="Search anything..."
                     className="focus:outline-hidden placeholder:text-[#D9D9D9] placeholder:text-[1rem] font-medium w-full"
                  />
               </div>
            </form>
         </div>
      </header>
   );
};

export default Header;

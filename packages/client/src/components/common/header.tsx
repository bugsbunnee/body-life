import type React from 'react';
import { useRef } from 'react';
import { FaSearch } from 'react-icons/fa';

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
      <header className="px-[1.5rem] pt-[3.375rem] pb-[1.875rem] flex items-center justify-between border-b border-b-border">
         <h1 className="text-2xl text-main font-medium">{title}</h1>

         <div>
            <form onSubmit={handleSubmitForm}>
               <div className="border border-gray-200 rounded-2xl h-14 px-4 min-w-[16rem] flex justify-start items-center gap-x-[0.75rem]">
                  <div className="">
                     <FaSearch className="text-xl text-[#BEBEBE]" />
                  </div>

                  <input
                     ref={ref}
                     type="text"
                     placeholder="Search anything..."
                     className="focus:outline-hidden placeholder:text-[#D9D9D9] placeholder:text-[1rem] font-medium"
                  />
               </div>
            </form>
         </div>
      </header>
   );
};

export default Header;

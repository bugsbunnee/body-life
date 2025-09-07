import type React from 'react';
import { Button } from '../ui/button';
import { Search, Trash } from 'lucide-react';

const Filters: React.FC = () => {
   return (
      <div className="px-6 py-8 border-b border-b-border">
         <div className="">
            <Button className="hover:bg-transparent shadow-none bg-transparent gap-x-4 font-medium text-gray-400 text-xl">
               <Search size={24} />
               Search
            </Button>
            <Button className="hover:bg-transparent shadow-none bg-transparent gap-x-4 font-medium text-gray-400 text-xl">
               <Trash size={24} />
               Delete
            </Button>
         </div>
      </div>
   );
};

export default Filters;

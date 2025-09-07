import type React from 'react';

import { Filter, Search, Trash } from 'lucide-react';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { Label } from '../ui/label';

const Filters: React.FC = () => {
   return (
      <div className="flex items-center justify-between p-6 border-b border-b-border">
         <div className="flex items-center gap-4">
            <Checkbox id="all" />
            <Label htmlFor="all" className="text-base text-gray-neutral">
               Select All
            </Label>
         </div>

         <div className="flex items-center">
            <Button className="hover:bg-transparent shadow-none bg-transparent gap-x-4 text-gray-neutral text-base">
               <Filter size={24} />
               Filters
            </Button>
            <Button className="hover:bg-transparent shadow-none bg-transparent gap-x-4 text-gray-neutral text-base">
               <Search size={24} />
               Search
            </Button>
            <Button className="hover:bg-transparent shadow-none bg-transparent gap-x-4 text-gray-neutral text-base">
               <Trash size={24} />
               Delete
            </Button>
         </div>
      </div>
   );
};

export default Filters;

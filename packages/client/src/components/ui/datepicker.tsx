import * as React from 'react';
import { format } from 'date-fns';
import { ChevronDown } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

export function DatePicker() {
   const [date, setDate] = React.useState<Date>();

   return (
      <Popover>
         <PopoverTrigger asChild>
            <Button
               variant="ghost"
               data-empty={!date}
               className="data-[empty=true]:bg-blue-light h-12 min-w-2xs p-4 rounded-md justify-start text-left font-medium text-base text-main"
            >
               <span className="flex-1">{date ? format(date, 'PPP') : 'Pick a date'}</span>
               <ChevronDown />
            </Button>
         </PopoverTrigger>

         <PopoverContent className="w-auto p-0">
            <Calendar mode="single" selected={date} onSelect={setDate} />
         </PopoverContent>
      </Popover>
   );
}

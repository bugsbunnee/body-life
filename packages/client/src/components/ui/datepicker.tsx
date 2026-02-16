import * as React from 'react';
import { Calendar1Icon, ChevronDown } from 'lucide-react';

import type { DateRange } from 'react-day-picker';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { formatDateRange } from '@/lib/utils';

interface Props {
   dateRange: DateRange;
   onSelectRange: (range: DateRange) => void;
}

export const RangeDatePicker: React.FC<Props> = ({ dateRange, onSelectRange }) => {
   const label = React.useMemo(() => {
      if (!dateRange.from && !dateRange.to) {
         return 'Pick a date';
      }

      return formatDateRange(dateRange);
   }, [dateRange]);

   return (
      <Popover>
         <PopoverTrigger asChild>
            <Button
               variant="ghost"
               data-empty={!dateRange.from && !dateRange.to}
               className="bg-blue-light h-12 min-w-2xs p-4 rounded-md justify-start flex gap-x-2 text-left font-medium text-base text-main"
            >
               <Calendar1Icon />

               <span className="flex-1">{label}</span>

               <ChevronDown />
            </Button>
         </PopoverTrigger>

         <PopoverContent className="w-auto p-0">
            <Calendar required mode="range" selected={dateRange} onSelect={onSelectRange} />
         </PopoverContent>
      </Popover>
   );
};

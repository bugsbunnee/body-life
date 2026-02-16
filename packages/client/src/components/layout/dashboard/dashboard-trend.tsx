import Conditional from '@/components/common/conditional';
import { cn } from '@/lib/utils';
import type React from 'react';
import { ChevronDown, ChevronsRightLeft, ChevronUp } from 'lucide-react';

interface Props {
   update: string;
   percentage: string;
}

const DashboardTrend: React.FC<Props> = ({ percentage, update }) => {
   return (
      <div
         className={cn({
            'flex items-center gap-x-1 text-xs font-bold rounded-xs': true,
            'bg-green-100 p-1 text-green-600': update === 'increment',
            'bg-red-100 p-1 text-red-600': update === 'decrement',
            'bg-orange-100 p-1 text-orange-600': update === 'same',
         })}
      >
         <Conditional visible={update === 'increment'}>
            <ChevronUp size={15} />
         </Conditional>

         <Conditional visible={update === 'decrement'}>
            <ChevronDown size={15} />
         </Conditional>

         <Conditional visible={update === 'same'}>
            <ChevronsRightLeft size={15} />
         </Conditional>

         <span>{percentage}</span>
      </div>
   );
};

export default DashboardTrend;

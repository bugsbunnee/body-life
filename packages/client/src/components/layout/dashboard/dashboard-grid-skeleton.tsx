import type React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const DashboardGridSkeleton: React.FC = () => {
   return (
      <div className="bg-slate-50 p-6 border rounded-lg">
         <div className="text-main">
            <Skeleton className="w-28 h-6" />
         </div>

         <div className="mt-6 text-dark">
            <Skeleton className="w-26 h-6" />
         </div>

         <div className="flex items-center gap-x-2 mt-2">
            <div className="flex items-center gap-x-1 font-bold rounded-xs">
               <Skeleton className="w-6 h-4" />
               <Skeleton className="w-6 h-1" />
            </div>

            <Skeleton className="w-8 h-4" />
         </div>
      </div>
   );
};

export default DashboardGridSkeleton;

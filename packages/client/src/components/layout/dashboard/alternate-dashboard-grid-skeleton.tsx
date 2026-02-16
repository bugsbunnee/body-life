import type React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const AlternateDashboardGridSkeleton: React.FC = () => {
   return (
      <div className="bg-slate-50 p-6 border rounded-lg">
         <div className="flex items-center justify-between">
            <div className="text-main">
               <Skeleton className="w-28 h-6" />
            </div>

            <Skeleton className="w-6 h-4" />
         </div>

         <div className="mt-6 text-dark">
            <Skeleton className="w-26 h-6" />
         </div>
      </div>
   );
};

export default AlternateDashboardGridSkeleton;

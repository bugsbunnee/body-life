import type React from 'react';

import { Skeleton } from '@/components/ui/skeleton';

const DashboardFollowUpSkeleton: React.FC = () => {
   return (
      <div className="flex items-start gap-x-6 py-4">
         <Skeleton className="rounded-full w-12 h-12" />

         <div className="flex-1 border-b border-b-border pb-4">
            <div className="text-base font-semibold text-main">
               <Skeleton className="w-44 h-6" />
            </div>

            <div className="text-base font-semibold text-main my-4">
               <Skeleton className="w-28 h-4" />
            </div>

            <div className="text-sm font-medium text-gray-600">
               <Skeleton className="w-52 h-4" />
            </div>
         </div>

         <div className="">
            <div className="text-sm font-medium text-gray-600">
               <Skeleton className="w-28 h-6" />
            </div>
         </div>
      </div>
   );
};

export default DashboardFollowUpSkeleton;

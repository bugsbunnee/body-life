import type React from 'react';
import _ from 'lodash';

import Conditional from '@/components/common/conditional';
import EmptyState from '@/components/common/empty-state';

import { formatDate } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

import type { User } from '@/utils/entities';
import { Badge } from '@/components/ui/badge';

interface Props {
   label: string;
   loading: boolean;
   data: User[];
}

const DashboardTable: React.FC<Props> = ({ label, loading, data }) => {
   return (
      <div className={cn({ 'p-6 rounded-lg border': true, 'bg-slate-50': loading, 'bg-blue-light': !loading })}>
         <Conditional visible={loading}>
            <Skeleton className="h-6 w-64 rounded-sm mb-8" />
         </Conditional>

         <Conditional visible={!loading}>
            <div className="font-medium text-main text-base mb-8">{label}</div>
         </Conditional>

         <table className="w-full">
            <tbody>
               <Conditional visible={loading}>
                  {_.range(1, 11).map((fill) => (
                     <tr key={fill} className="font-medium text-base">
                        <td className="pb-4">
                           <Skeleton className="h-6 w-44 rounded-sm" />
                        </td>

                        <td className="pb-4">
                           <Skeleton className="h-6 w-44 rounded-sm" />
                        </td>

                        <td className="pb-4 inline-block">
                           <Skeleton className="h-6 w-16 rounded-sm" />
                        </td>
                     </tr>
                  ))}
               </Conditional>

               <Conditional visible={!loading}>
                  <Conditional visible={data.length > 0}>
                     {data.map((datum) => (
                        <tr key={datum._id} className="text-gray-neutral font-medium text-base">
                           <td className="pb-6">
                              {datum.firstName} {datum.lastName}
                           </td>

                           <td className="pb-6">{formatDate(datum.dateOfBirth, 'dd MMMM')}</td>

                           <td className="pb-6 flex items-center">
                              <Badge className="bg-orange-100 text-orange-600">Birthday</Badge>
                           </td>
                        </tr>
                     ))}
                  </Conditional>

                  <Conditional visible={data.length === 0}>
                     <EmptyState title="No upcoming celebrations" description="No celebrations within the specified time range" />
                  </Conditional>
               </Conditional>
            </tbody>
         </table>
      </div>
   );
};

export default DashboardTable;

import type React from 'react';
import _ from 'lodash';

import Conditional from '@/components/common/conditional';
import EmptyState from '@/components/common/empty-state';

import { formatDate } from 'date-fns';
import { FaBirthdayCake, FaSpinner } from 'react-icons/fa';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import { cn, getErrorMessage, getIsBirthdayExpired, getIsRolePermitted } from '@/lib/utils';

import { type User } from '@/utils/entities';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ROLES } from '@/utils/constants';

import useAuthStore from '@/store/auth';
import http from '@/services/http.service';

interface Props {
   label: string;
   loading: boolean;
   data: User[];
}

const DashboardTable: React.FC<Props> = ({ label, loading, data }) => {
   const auth = useAuthStore();

   const mutation = useMutation({
      mutationFn: () => http.get('/api/birthday'),
      onSuccess: () => toast.success('Birthday congratulatory messages sent successfully'),
      onError: (error) => toast.error('Failed to send congratulatory messages sent successfully', { description: getErrorMessage(error) }),
   });

   return (
      <div className={cn({ 'p-6 rounded-xl border': true, 'bg-slate-50': loading, 'bg-blue-light': !loading })}>
         <Conditional visible={loading}>
            <Skeleton className="h-6 w-64 rounded-xl mb-8" />
         </Conditional>

         <Conditional visible={!loading}>
            <div className="flex items-center justify-between mb-8">
               <div className="font-medium text-main text-base">{label}</div>

               <div>
                  <Button variant="ghost" onClick={() => mutation.mutate()} className="text-xs text-main font-bold uppercase bg-transparent rounded-xl">
                     <Conditional visible={mutation.isPending}>
                        <div className="animate-spin">
                           <FaSpinner />
                        </div>

                        <span>Sending Birthday Wishes...</span>
                     </Conditional>

                     <Conditional visible={auth.auth ? getIsRolePermitted(ROLES.CORE, auth.auth.admin.userRole) : false}>
                        <Conditional visible={!mutation.isPending}>
                           <FaBirthdayCake className="size-3" />
                           Send Birthday Wishes
                        </Conditional>
                     </Conditional>
                  </Button>
               </div>
            </div>
         </Conditional>

         <table className="w-full">
            <tbody>
               <Conditional visible={loading}>
                  {_.range(1, 11).map((fill) => (
                     <tr key={fill} className="font-medium text-base">
                        <td className="pb-4">
                           <Skeleton className="h-6 w-44 rounded-xl" />
                        </td>

                        <td className="pb-4">
                           <Skeleton className="h-6 w-44 rounded-xl" />
                        </td>

                        <td className="pb-4 inline-block">
                           <Skeleton className="h-6 w-16 rounded-xl" />
                        </td>
                     </tr>
                  ))}
               </Conditional>

               <Conditional visible={!loading}>
                  <Conditional visible={data.length > 0}>
                     {data.map((datum) => {
                        const isExpired = getIsBirthdayExpired(datum.dateOfBirth);

                        return (
                           <tr key={datum._id} className="text-gray-neutral font-medium text-base">
                              <td className="pb-6">
                                 {datum.firstName} {datum.lastName}
                              </td>

                              <td className="pb-6">{formatDate(datum.dateOfBirth, 'dd MMMM')}</td>

                              <td className="pb-6 flex items-center">
                                 <Badge
                                    className={cn({
                                       'bg-orange-100 text-orange-500': isExpired,
                                       'bg-green-100 text-green-600': !isExpired,
                                    })}
                                 >
                                    {isExpired ? 'Expired' : 'Upcoming'}
                                 </Badge>
                              </td>
                           </tr>
                        );
                     })}
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

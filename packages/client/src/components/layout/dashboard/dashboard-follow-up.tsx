import React, { useMemo } from 'react';

import { formatDate } from 'date-fns';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { getInitials } from '@/lib/utils';

import type { FollowUp } from '@/utils/entities';

interface Props {
   followUp: FollowUp;
}

const DashboardFollowUp: React.FC<Props> = ({ followUp }) => {
   const fullName = useMemo(() => {
      return `${followUp.user.firstName} ${followUp.user.lastName}`;
   }, [followUp.user]);

   return (
      <div className="flex items-start gap-x-6 py-4">
         <Avatar className="w-12 h-12">
            <AvatarFallback>{getInitials(fullName)}</AvatarFallback>
         </Avatar>

         <div className="flex-1 border-b border-b-border pb-4">
            <div className="text-base font-semibold text-main capitalize">{fullName}</div>
            <div className="text-base font-semibold text-main">{followUp.user.phoneNumber}</div>
            <div className="text-sm font-medium text-gray-600">Visited on: {formatDate(followUp.service.serviceDate, 'dd MMM, yyyy')}</div>
         </div>

         <div>
            <Badge>{followUp.status}</Badge>
         </div>
      </div>
   );
};

export default DashboardFollowUp;

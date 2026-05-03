import type React from 'react';

import { UserRole } from '@/utils/entities';
import { Badge } from '../ui/badge';
import { cn } from '@/lib/utils';

interface Props {
   role: UserRole;
}

const Role: React.FC<Props> = ({ role }) => {
   return (
      <Badge
         className={cn({
            capitalize: true,
            'bg-purple-600': role === UserRole.Pastor,
            'bg-blue-400': role === UserRole.PrayerCellLeader,
            'bg-amber-600': role === UserRole.Hod,
            'bg-green-600': role === UserRole.Member,
            'bg-red-500': role === UserRole.Worker,
            'bg-gray-500': role === UserRole.External,
            'bg-cyan-500': role === UserRole.Admin,
         })}
      >
         {role}
      </Badge>
   );
};

export default Role;

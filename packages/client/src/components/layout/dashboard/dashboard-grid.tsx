import type React from 'react';
import DashboardTrend from './dashboard-trend';

interface Props {
   label: string;
   value: number;
   comparator: string;
   percentage: string;
   update: string;
}

const DashboardGrid: React.FC<Props> = ({ comparator, label, value, percentage, update }) => {
   return (
      <div className="bg-blue-light p-6 border rounded-lg">
         <div className="text-base text-main font-medium capitalize">{label}</div>
         <div className="text-xl mt-6 text-dark font-medium capitalize">{value}</div>

         <div className="flex items-center gap-x-2 mt-2">
            <DashboardTrend update={update} percentage={percentage} />

            <div className="text-sm text-gray-neutral font-medium capitalize">Compared to {comparator}</div>
         </div>
      </div>
   );
};

export default DashboardGrid;

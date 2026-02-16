import type React from 'react';
import DashboardTrend from './dashboard-trend';

interface Props {
   label: string;
   value: number;
   percentage: string;
   update: string;
}

const AlternateDashboardGrid: React.FC<Props> = ({ label, value, percentage, update }) => {
   return (
      <div className="bg-blue-light p-6 border rounded-lg">
         <div className="items-center flex justify-between">
            <div className="text-base text-main font-medium capitalize">{label}</div>

            <DashboardTrend update={update} percentage={percentage} />
         </div>

         <div className="text-xl mt-6 text-dark font-medium capitalize">{value}</div>
      </div>
   );
};

export default AlternateDashboardGrid;

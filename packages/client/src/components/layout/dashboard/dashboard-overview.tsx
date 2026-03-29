import type React from 'react';

interface Props {
   label: string;
   value: string;
}

const DashboardOverview: React.FC<Props> = ({ label, value }) => {
   return (
      <div className="bg-white p-4 md:p-6 border rounded-xl">
         <div className="text-base text-main font-medium capitalize">{label}</div>
         <div className="text-xl mt-6 text-dark font-medium capitalize">{value}</div>
      </div>
   );
};

export default DashboardOverview;

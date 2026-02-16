import type React from 'react';

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface Props {
   data: Record<string, string | number>[];
   labelKey: string;
   valueKey: string;
}

const DashboardLineChart: React.FC<Props> = ({ data, labelKey, valueKey }) => {
   return (
      <ResponsiveContainer width="100%" height={280}>
         <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
            <XAxis dataKey={labelKey} tick={{ fontSize: 12, fill: '#555' }} tickFormatter={(date) => date.slice(5)} />

            <YAxis tick={{ fontSize: 12, fill: '#555' }} allowDecimals={false} domain={['dataMin - 5', 'dataMax + 5']} />

            <Tooltip />

            <Line type="monotone" dataKey={valueKey} stroke="#022a68" strokeWidth={3} dot={{ r: 5, fill: '#022a68"', stroke: '#fff', strokeWidth: 2 }} activeDot={{ r: 7 }} />
         </LineChart>
      </ResponsiveContainer>
   );
};

export default DashboardLineChart;

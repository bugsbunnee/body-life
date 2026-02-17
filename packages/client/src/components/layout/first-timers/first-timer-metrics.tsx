import React from 'react';
import _ from 'lodash';

import AlternateDashboardGrid from '../dashboard/alternate-dashboard-grid';
import AlternateDashboardGridSkeleton from '../dashboard/alternate-dashboard-grid-skeleton';
import Conditional from '@/components/common/conditional';

import { formatDateRange } from '@/lib/utils';

import useDashboard from '@/hooks/useDashboard';
import useQueryStore from '@/store/query';

const FirstTimerMetrics = () => {
   const { data, isFetching } = useDashboard();
   const { dateRangeQuery } = useQueryStore();

   const label = React.useMemo(() => {
      return formatDateRange({ from: dateRangeQuery.startDate, to: dateRangeQuery.endDate });
   }, [dateRangeQuery]);

   return (
      <React.Fragment>
         <Conditional visible={isFetching}>
            {_.range(1, 5).map((fill) => (
               <AlternateDashboardGridSkeleton key={fill} />
            ))}
         </Conditional>

         <Conditional visible={!isFetching}>
            <AlternateDashboardGrid
               label={`Total First Timers (${label})`}
               value={data.firstTimerInsights.totalFirstTimers.current}
               update={data.firstTimerInsights.totalFirstTimers.trend}
               percentage={data.firstTimerInsights.totalFirstTimers.difference}
            />

            <AlternateDashboardGrid
               label={`Uncontacted First Timers (${label})`}
               value={data.firstTimerInsights.uncontactedFirstTimers.current}
               update={data.firstTimerInsights.uncontactedFirstTimers.trend}
               percentage={data.firstTimerInsights.uncontactedFirstTimers.difference}
            />

            <AlternateDashboardGrid
               label={`Due for Follow-Up (${label})`}
               value={data.firstTimerInsights.overdueFollowUp.current}
               update={data.firstTimerInsights.overdueFollowUp.trend}
               percentage={data.firstTimerInsights.overdueFollowUp.difference}
            />

            <AlternateDashboardGrid
               label={`Contacted First Timers (${label})`}
               value={data.firstTimerInsights.contactsMade.current}
               update={data.firstTimerInsights.contactsMade.trend}
               percentage={data.firstTimerInsights.contactsMade.difference}
            />
         </Conditional>
      </React.Fragment>
   );
};

export default FirstTimerMetrics;

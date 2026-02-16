import React from 'react';
import _ from 'lodash';

import { Link, useNavigate } from 'react-router-dom';
import { APP_ROUTES } from '@/utils/constants';
import { RangeDatePicker } from '@/components/ui/datepicker';

import AlternateDashboardGrid from '@/components/layout/dashboard/alternate-dashboard-grid';
import AlternateDashboardGridSkeleton from '@/components/layout/dashboard/alternate-dashboard-grid-skeleton';
import Conditional from '@/components/common/conditional';
import DashboardLineChart from '@/components/layout/dashboard/line-chart';
import DashboardTable from '@/components/layout/dashboard/dashboard-table';
import DashboardFollowUp from '@/components/layout/dashboard/dashboard-follow-up';
import DashboardFollowUpSkeleton from '@/components/layout/dashboard/dashboard-follow-up-skeleton';
import DashboardGrid from '@/components/layout/dashboard/dashboard-grid';
import DashboardGridSkeleton from '@/components/layout/dashboard/dashboard-grid-skeleton';
import EmptyState from '@/components/common/empty-state';
import Header from '@/components/common/header';

import useDashboard from '@/hooks/useDashboard';
import useQueryStore from '@/store/query';
import { formatDateRange } from '@/lib/utils';

const HomePage: React.FC = () => {
   const { dateRangeQuery, onSetSearch, onSetDateRange } = useQueryStore();
   const { data, isFetching } = useDashboard();

   const navigate = useNavigate();

   const label = React.useMemo(() => {
      return formatDateRange({ from: dateRangeQuery.startDate, to: dateRangeQuery.endDate });
   }, [dateRangeQuery]);

   return (
      <>
         <Header title="Dashboard" onSearch={onSetSearch} />

         <div className="p-6 border-b-border border-b ">
            <div className="flex items-center justify-between mb-8">
               <div className="">
                  <div className="text-base text-black font-semibold">Analytics</div>
                  <div className="text-base text-gray-neutral mt-[0.25rem]">See key insights</div>
               </div>

               <div className="flex gap-x-4">
                  <RangeDatePicker
                     dateRange={{ from: dateRangeQuery.startDate, to: dateRangeQuery.endDate }}
                     onSelectRange={(range) => onSetDateRange({ startDate: range.from!, endDate: range.to! })}
                  />
               </div>
            </div>

            <div className="grid grid-cols-4 gap-x-4">
               <Conditional visible={isFetching}>
                  {_.range(1, 5).map((fill) => (
                     <DashboardGridSkeleton key={fill} />
                  ))}
               </Conditional>

               <Conditional visible={!isFetching}>
                  <DashboardGrid
                     label="Total Members"
                     value={data.userInsights.totalUsers.current}
                     update={data.userInsights.totalUsers.trend}
                     percentage={data.userInsights.totalUsers.difference}
                     comparator={data.metadata.durationLabel}
                  />

                  <DashboardGrid
                     label="Total Workforce"
                     value={data.userInsights.totalWorkforce.current}
                     update={data.userInsights.totalWorkforce.trend}
                     percentage={data.userInsights.totalWorkforce.difference}
                     comparator={data.metadata.durationLabel}
                  />

                  <DashboardGrid
                     label="Total Non Workforce"
                     value={data.userInsights.totalNonWorkforce.current}
                     update={data.userInsights.totalNonWorkforce.trend}
                     percentage={data.userInsights.totalNonWorkforce.difference}
                     comparator={data.metadata.durationLabel}
                  />

                  <DashboardGrid
                     label={`Birthdays ${label}`}
                     value={data.userBirthdays.pagination.totalCount}
                     update="same"
                     percentage={'-'}
                     comparator={data.metadata.durationLabel}
                  />
               </Conditional>
            </div>
         </div>

         <div className="border-b-border border-b grid grid-cols-2">
            <div className="p-6 border-r-border border-r">
               <div className="flex items-center justify-between mb-8">
                  <div className="">
                     <div className="text-base text-black font-semibold">First Timers</div>
                     <div className="text-base text-gray-neutral mt-[0.25rem]">See key insights</div>
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-6">
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
               </div>
            </div>

            <div className="p-6 bg-gray-light">
               <div className="font-medium text-main text-center mb-5">
                  <h2>Attendance Trend for Services</h2>
               </div>

               <div className="p-4 bg-white rounded-lg border">
                  <DashboardLineChart data={data.attendanceTrend} labelKey="serviceDate" valueKey="totalAttendance" />
               </div>
            </div>
         </div>

         <div className="border-b-border border-b grid grid-cols-2">
            <div className="p-6 border-r border-r-border">
               <DashboardTable label="Upcoming Celebrations" loading={isFetching} data={data.userBirthdays.data} />
            </div>

            <div className="p-6">
               <div className="items-center flex justify-between mb-8">
                  <div className="text-base text-main font-semibold">Uncontacted First Timers</div>

                  <div>
                     <Link to={APP_ROUTES.FIRST_TIMERS} className="text-base text-gray-neutral font-semibold underline">
                        See All
                     </Link>
                  </div>
               </div>

               <Conditional visible={isFetching}>
                  {_.range(1, 4).map((fill) => (
                     <DashboardFollowUpSkeleton key={fill} />
                  ))}
               </Conditional>

               <Conditional visible={!isFetching}>
                  <Conditional visible={data.uncontactedFirstTimers.length > 0}>
                     {data.uncontactedFirstTimers.map((user) => (
                        <DashboardFollowUp key={user._id} followUp={user} />
                     ))}
                  </Conditional>

                  <Conditional visible={data.uncontactedFirstTimers.length === 0}>
                     <EmptyState
                        title="No uncontacted first timers"
                        description="No first timers yet to be contacted within the specified time range"
                        onAdd={() => navigate(APP_ROUTES.MEMBERS)}
                     />
                  </Conditional>
               </Conditional>
            </div>
         </div>
      </>
   );
};

export default HomePage;

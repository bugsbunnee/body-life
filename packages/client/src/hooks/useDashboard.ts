import { getServiceOverview } from '@/services/dashboard.service';
import { useQuery } from '@tanstack/react-query';

import useQueryStore from '@/store/query';

const useDashboard = () => {
   const { dateRangeQuery } = useQueryStore();

   return useQuery({
      queryKey: ['dashboard', dateRangeQuery],
      queryFn: () => getServiceOverview(dateRangeQuery.startDate!, dateRangeQuery.endDate!),
      initialData: {
         attendanceTrend: [],
         uncontactedFirstTimers: [],
         userBirthdays: {
            data: [],
            pagination: {
               pageNumber: 1,
               pageSize: 10,
               totalCount: 0,
               totalPages: 0,
            },
         },
         prayerCellInsights: {
            totalPrayerCells: {
               current: 0,
               difference: '12%',
               trend: 'increment',
            },
         },
         userInsights: {
            totalUsers: {
               current: 0,
               difference: '12%',
               trend: 'increment',
            },
            totalWorkforce: {
               current: 0,
               difference: '12%',
               trend: 'increment',
            },
            totalNonWorkforce: {
               current: 0,
               difference: '12%',
               trend: 'increment',
            },
         },
         firstTimerInsights: {
            totalFirstTimers: {
               current: 0,
               difference: '12%',
               trend: 'increment',
            },
            uncontactedFirstTimers: {
               current: 0,
               difference: '12%',
               trend: 'increment',
            },
            overdueFollowUp: {
               current: 0,
               difference: '12%',
               trend: 'increment',
            },
            contactsMade: {
               current: 0,
               difference: '12%',
               trend: 'increment',
            },
         },
         metadata: {
            currentStartDate: '',
            currentEndDate: '',
            durationLabel: '',
            differenceInDays: 0,
            previousStartDate: '',
            previousEndDate: '',
         },
      },
   });
};

export default useDashboard;

import axios from 'axios';

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { formatDate } from 'date-fns';

import type { ApiResponse, FirstTimer } from '@/utils/entities';

import useQueryStore from '@/store/query';

const useFirstTimers = () => {
   const { firstTimerQuery, dateRangeQuery } = useQueryStore();

   const query = useMemo(() => {
      return {
         ...firstTimerQuery,
         dateJoinedStart: formatDate(dateRangeQuery.startDate, 'yyyy-MM-dd'),
         dateJoinedEnd: formatDate(dateRangeQuery.endDate, 'yyyy-MM-dd'),
      };
   }, [firstTimerQuery, dateRangeQuery]);

   return useQuery({
      queryKey: ['first-timers', query],
      queryFn: () => axios.get<ApiResponse<FirstTimer>>('/api/followup', { params: query }).then((response) => response.data),
      initialData: {
         data: [],
         pagination: {
            pageNumber: 1,
            pageSize: 10,
            totalCount: 0,
            totalPages: 1,
         },
      },
   });
};

export default useFirstTimers;

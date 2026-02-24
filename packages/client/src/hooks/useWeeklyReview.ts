import { useQuery } from '@tanstack/react-query';
import type { ApiResponse, WeeklyReview } from '@/utils/entities';

import useQueryStore from '@/store/query';
import http from '@/services/http.service';

const useWeeklyReview = () => {
   const { weeklyReviewQuery } = useQueryStore();

   return useQuery({
      queryKey: ['weekly-review', weeklyReviewQuery],
      queryFn: () => http.get<{ data: ApiResponse<WeeklyReview> }>('/api/weekly-review', { params: weeklyReviewQuery }).then((response) => response.data),
      initialData: {
         data: {
            data: [],
            pagination: {
               pageNumber: 1,
               pageSize: 10,
               totalCount: 0,
               totalPages: 1,
            },
         },
      },
   });
};

export default useWeeklyReview;

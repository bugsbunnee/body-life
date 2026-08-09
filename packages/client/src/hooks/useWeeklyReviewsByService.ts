import { useQuery } from '@tanstack/react-query';
import type { ApiResponse, WeeklyReview } from '@/utils/entities';

import http from '@/services/http.service';

const useWeeklyReviewsByService = (serviceReportId?: string) => {
   return useQuery({
      queryKey: ['weekly-review-by-service', serviceReportId],
      queryFn: () => http.get<{ data: ApiResponse<WeeklyReview> }>('/api/weekly-review', { params: { service: serviceReportId, pageSize: 100 } }).then((response) => response.data),
      enabled: !!serviceReportId,
      initialData: {
         data: {
            data: [],
            pagination: {
               pageNumber: 1,
               pageSize: 100,
               totalCount: 0,
               totalPages: 1,
            },
         },
      },
   });
};

export default useWeeklyReviewsByService;

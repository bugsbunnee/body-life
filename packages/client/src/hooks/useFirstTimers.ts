import { useQuery } from '@tanstack/react-query';
import type { ApiResponse, FirstTimer } from '@/utils/entities';

import useQueryStore from '@/store/query';
import http from '@/services/http.service';

const useFirstTimers = () => {
   const { firstTimerQuery } = useQueryStore();

   return useQuery({
      queryKey: ['first-timers', firstTimerQuery],
      queryFn: () => http.get<ApiResponse<FirstTimer>>('/api/followup', { params: firstTimerQuery }).then((response) => response.data),
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

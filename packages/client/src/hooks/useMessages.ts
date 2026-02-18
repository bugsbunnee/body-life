import http from '@/services/http.service';
import useQueryStore from '@/store/query';

import type { ApiResponse, IMessage } from '@/utils/entities';
import { useQuery } from '@tanstack/react-query';

const useMessages = () => {
   const { query } = useQueryStore();

   return useQuery({
      queryKey: ['message', query],
      queryFn: () => http.get<{ data: ApiResponse<IMessage> }>('/api/message', { params: query }).then((response) => response.data),
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

export default useMessages;

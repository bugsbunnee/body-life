import useQueryStore from '@/store/query';
import http from '@/services/http.service';

import { useQuery } from '@tanstack/react-query';
import type { ApiResponse, Requisition } from '@/utils/entities';

const useRequisitions = () => {
   const { requisitionQuery } = useQueryStore();

   return useQuery({
      queryKey: ['requisitions', requisitionQuery],
      queryFn: () => http.get<ApiResponse<Requisition>>('/api/requisition', { params: requisitionQuery }).then((response) => response.data),
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

export default useRequisitions;

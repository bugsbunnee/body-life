import useQueryStore from '@/store/query';
import http from '@/services/http.service';

import { useQuery } from '@tanstack/react-query';
import type { ApiResponse, Program } from '@/utils/entities';

const usePrograms = () => {
   const { programQuery } = useQueryStore();

   return useQuery({
      queryKey: ['programs', programQuery],
      queryFn: () => http.get<{ data: ApiResponse<Program> }>('/api/program', { params: programQuery }).then((response) => response.data),
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

export default usePrograms;

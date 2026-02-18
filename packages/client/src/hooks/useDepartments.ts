import { useQuery } from '@tanstack/react-query';
import type { ApiResponse, Department } from '@/utils/entities';

import useQueryStore from '@/store/query';
import http from '@/services/http.service';

const useDepartments = () => {
   const { departmentQuery } = useQueryStore();

   return useQuery({
      queryKey: ['departments', departmentQuery],
      queryFn: () => http.get<{ data: ApiResponse<Department> }>('/api/department', { params: departmentQuery }).then((response) => response.data),
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

export default useDepartments;

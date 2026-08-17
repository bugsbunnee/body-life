import { useQuery } from '@tanstack/react-query';
import type { ApiResponse, Department } from '@/utils/entities';

import useQueryStore from '@/store/query';
import http from '@/services/http.service';

const useDepartments = (pageSize?: number) => {
   const { departmentQuery } = useQueryStore();
   const params = pageSize ? { ...departmentQuery, pageSize } : departmentQuery;

   return useQuery({
      queryKey: ['departments', params],
      queryFn: () => http.get<{ data: ApiResponse<Department> }>('/api/department', { params }).then((response) => response.data),
      initialData: {
         data: {
            data: [],
            pagination: {
               pageNumber: 1,
               pageSize: pageSize ?? 10,
               totalCount: 0,
               totalPages: 1,
            },
         },
      },
   });
};

export default useDepartments;

import axios from 'axios';
import useQueryStore from '@/store/query';

import { useQuery } from '@tanstack/react-query';
import type { ApiResponse, User } from '@/utils/entities';

const useUsers = () => {
   const { userQuery } = useQueryStore();

   return useQuery({
      queryKey: ['users', userQuery],
      queryFn: () => axios.get<{ data: ApiResponse<User> }>('/api/user', { params: userQuery }).then((response) => response.data),
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

export default useUsers;

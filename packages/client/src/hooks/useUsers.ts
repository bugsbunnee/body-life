import useUserStore from '@/store/user';
import type { User } from '@/utils/entities';
import { useQuery } from '@tanstack/react-query';

import axios from 'axios';

interface UserResponse {
   data: User[];
   pagination: {
      pageNumber: number;
      pageSize: number;
      totalPages: number;
      totalCount: number;
   };
}

const useUsers = () => {
   const { query } = useUserStore();

   return useQuery({
      queryKey: ['users', query],
      queryFn: () => axios.get<{ data: UserResponse }>('/api/user', { params: query }).then((response) => response.data),
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

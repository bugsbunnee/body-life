import type { User } from '@/utils/entities';
import { useQuery } from '@tanstack/react-query';

import axios from 'axios';

const useUsers = () => {
   return useQuery({
      queryKey: ['users'],
      queryFn: () => axios.get<{ data: User[] }>('/api/user').then((response) => response.data),
      initialData: { data: [] },
   });
};

export default useUsers;

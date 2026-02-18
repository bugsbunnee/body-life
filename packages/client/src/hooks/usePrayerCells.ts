import axios from 'axios';

import { useQuery } from '@tanstack/react-query';
import type { ApiResponse, PrayerCell } from '@/utils/entities';

import useQueryStore from '@/store/query';

const usePrayerCells = () => {
   const { prayerCellQuery } = useQueryStore();

   return useQuery({
      queryKey: ['prayer-cells', prayerCellQuery],
      queryFn: () => axios.get<{ data: ApiResponse<PrayerCell> }>('/api/prayer-cell', { params: prayerCellQuery }).then((response) => response.data),
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

export default usePrayerCells;

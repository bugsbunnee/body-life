import { useQuery } from '@tanstack/react-query';
import type { ApiResponse, InventoryItem } from '@/utils/entities';

import useQueryStore from '@/store/query';
import http from '@/services/http.service';

interface InventoryAggregationPerDepartment {
   departmentId: string;
   departmentName: string;
   totalQuantity: number;
   totalItems: number;
   totalAmount: number;
}

interface InventoryResponse extends ApiResponse<InventoryItem> {
   aggregated: InventoryAggregationPerDepartment[];
}

const useInventory = () => {
   const { inventoryQuery } = useQueryStore();

   return useQuery({
      queryKey: ['inventory', inventoryQuery],
      queryFn: () => http.get<{ data: InventoryResponse }>('/api/inventory', { params: inventoryQuery }).then((response) => response.data),

      initialData: {
         data: {
            data: [],
            aggregated: [],
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

export default useInventory;

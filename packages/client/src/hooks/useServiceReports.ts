import { getServiceReports } from '@/services/dashboard.service';
import { useQuery } from '@tanstack/react-query';

import useQueryStore from '@/store/query';

const useServiceReports = () => {
   const { serviceReportQuery } = useQueryStore();

   return useQuery({
      queryKey: ['service-reports', serviceReportQuery],
      queryFn: () => getServiceReports(serviceReportQuery.startDate!, serviceReportQuery.endDate!),
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

export default useServiceReports;

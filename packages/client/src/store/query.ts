import { create } from 'zustand';

import dayjs from 'dayjs';

interface Query {
   search?: string;
   field?: string;
   pageNumber?: number;
   pageSize?: number;
}

interface DateRangeQuery {
   startDate: Date;
   endDate: Date;
}

interface FirstTimerQuery {
   status?: string;
   preferredContactMethod?: string;
   assignedTo?: string;
}

interface QueryStore {
   query: Query;
   dateRangeQuery: DateRangeQuery;
   firstTimerQuery: FirstTimerQuery;
   resetQuery: () => void;
   onSetSearch: (search: string) => void;
   onSetFirstTimer: (firstTimer: FirstTimerQuery) => void;
   onSetDateRange: (dateRange: DateRangeQuery) => void;
   onSetPageNumber: (pageNumber: number) => void;
   onSetPageSize: (pageSize: number) => void;
   onSetField: (field: string) => void;
}

const useQueryStore = create<QueryStore>((set) => ({
   query: {
      pageNumber: 1,
      pageSize: 10,
   },
   dateRangeQuery: {
      startDate: dayjs().startOf('month').toDate(),
      endDate: dayjs().endOf('month').toDate(),
   },
   firstTimerQuery: {},
   resetQuery: () => set(() => ({ query: {}, firstTimerQuery: {} })),
   onSetField: (field) => set((store) => ({ query: { ...store.query, field } })),
   onSetDateRange: (dateRange) => set((store) => ({ dateRangeQuery: { ...store.dateRangeQuery, ...dateRange } })),
   onSetPageNumber: (pageNumber) => set((store) => ({ query: { ...store.query, pageNumber } })),
   onSetFirstTimer: (firstTimer) => set((store) => ({ firstTimerQuery: { ...store.firstTimerQuery, ...firstTimer } })),
   onSetPageSize: (pageSize) => set((store) => ({ query: { ...store.query, pageSize } })),
   onSetSearch: (search) => set((store) => ({ query: { ...store.query, search } })),
}));

export default useQueryStore;

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

interface QueryStore {
   query: Query;
   dateRangeQuery: DateRangeQuery;
   resetQuery: () => void;
   onSetSearch: (search: string) => void;
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
   resetQuery: () => set(() => ({ query: {} })),
   onSetField: (field) => set((store) => ({ query: { ...store.query, field } })),
   onSetDateRange: (dateRange) => set((store) => ({ dateRangeQuery: { ...store.dateRangeQuery, ...dateRange } })),
   onSetPageNumber: (pageNumber) => set((store) => ({ query: { ...store.query, pageNumber } })),
   onSetPageSize: (pageSize) => set((store) => ({ query: { ...store.query, pageSize } })),
   onSetSearch: (search) => set((store) => ({ query: { ...store.query, search } })),
}));

export default useQueryStore;

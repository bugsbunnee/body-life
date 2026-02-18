import { create } from 'zustand';

import dayjs from 'dayjs';

interface PaginationQuery {
   pageNumber?: number;
   pageSize?: number;
}

interface Query extends PaginationQuery {
   search?: string;
   field?: string;
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

interface PrayerCellQuery {
   name?: string;
   leader?: string;
   address?: string;
   meetingDay?: string;
   meetingTime?: string;
}

interface UserQuery extends PaginationQuery {
   firstName?: string;
   lastName?: string;
   email?: string;
   phoneNumber?: string;
   prayerCell?: string;
}

interface QueryStore {
   query: Query;
   dateRangeQuery: DateRangeQuery;
   firstTimerQuery: FirstTimerQuery;
   prayerCellQuery: PrayerCellQuery;
   userQuery: UserQuery;
   resetQuery: () => void;
   onSetSearch: (search: string) => void;
   onSetFirstTimer: (firstTimer: FirstTimerQuery) => void;
   onSetPrayerCell: (prayerCell: PrayerCellQuery) => void;
   onSetUser: (user: UserQuery) => void;
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
   prayerCellQuery: {},
   userQuery: {},
   resetQuery: () => set(() => ({ query: {}, firstTimerQuery: {}, prayerCellQuery: {}, userQuery: {} })),
   onSetPrayerCell: (prayerCell) => set((store) => ({ prayerCellQuery: { ...store.prayerCellQuery, ...prayerCell } })),
   onSetUser: (user) => set((store) => ({ userQuery: { ...store.userQuery, ...user } })),
   onSetField: (field) => set((store) => ({ query: { ...store.query, field } })),
   onSetDateRange: (dateRange) => set((store) => ({ dateRangeQuery: { ...store.dateRangeQuery, ...dateRange } })),
   onSetPageNumber: (pageNumber) => set((store) => ({ query: { ...store.query, pageNumber } })),
   onSetFirstTimer: (firstTimer) => set((store) => ({ firstTimerQuery: { ...store.firstTimerQuery, ...firstTimer } })),
   onSetPageSize: (pageSize) => set((store) => ({ query: { ...store.query, pageSize } })),
   onSetSearch: (search) => set((store) => ({ query: { ...store.query, search } })),
}));

export default useQueryStore;

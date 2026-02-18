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

interface DepartmentQuery {
   name?: string;
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

interface InventoryQuery {
   search?: string;
   department?: string;
   datePurchasedStart?: Date;
   datePurchasedEnd?: Date;
   minPrice?: number;
   maxPrice?: number;
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
   departmentQuery: DepartmentQuery;
   inventoryQuery: InventoryQuery;
   userQuery: UserQuery;
   resetQuery: () => void;
   onSetSearch: (search: string) => void;
   onSetFirstTimer: (firstTimer: FirstTimerQuery) => void;
   onSetDepartment: (department: DepartmentQuery) => void;
   onSetInventory: (inventory: InventoryQuery) => void;
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
   departmentQuery: {},
   inventoryQuery: { minPrice: 0, maxPrice: 6_000_000 },
   userQuery: {},
   resetQuery: () => set(() => ({ query: {}, firstTimerQuery: {}, prayerCellQuery: {}, userQuery: {}, inventoryQuery: { minPrice: 0, maxPrice: 6_000_000 }, departmentQuery: {} })),
   onSetPrayerCell: (prayerCell) => set((store) => ({ prayerCellQuery: { ...store.prayerCellQuery, ...prayerCell } })),
   onSetInventory: (inventory) => set((store) => ({ inventoryQuery: { ...store.inventoryQuery, ...inventory } })),
   onSetDepartment: (department) => set((store) => ({ departmentQuery: { ...store.departmentQuery, ...department } })),
   onSetUser: (user) => set((store) => ({ userQuery: { ...store.userQuery, ...user } })),
   onSetField: (field) => set((store) => ({ query: { ...store.query, field } })),
   onSetDateRange: (dateRange) => set((store) => ({ dateRangeQuery: { ...store.dateRangeQuery, ...dateRange } })),
   onSetPageNumber: (pageNumber) => set((store) => ({ query: { ...store.query, pageNumber } })),
   onSetFirstTimer: (firstTimer) => set((store) => ({ firstTimerQuery: { ...store.firstTimerQuery, ...firstTimer } })),
   onSetPageSize: (pageSize) => set((store) => ({ query: { ...store.query, pageSize } })),
   onSetSearch: (search) => set((store) => ({ query: { ...store.query, search } })),
}));

export default useQueryStore;

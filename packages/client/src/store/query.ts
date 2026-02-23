import { create } from 'zustand';

import dayjs from 'dayjs';

interface DateRangeQuery {
   startDate?: Date;
   endDate?: Date;
}

interface PaginationQuery {
   pageNumber?: number;
   pageSize?: number;
}

interface Query extends PaginationQuery {
   search?: string;
   field?: string;
}

interface DepartmentQuery extends PaginationQuery {
   name?: string;
}

interface FirstTimerQuery extends PaginationQuery {
   status?: string;
   preferredContactMethod?: string;
   assignedTo?: string;
   dateJoinedStart?: Date;
   dateJoinedEnd?: Date;
}

interface InventoryQuery extends PaginationQuery {
   search?: string;
   department?: string;
   datePurchasedStart?: Date;
   datePurchasedEnd?: Date;
   minPrice?: number;
   maxPrice?: number;
}

interface PrayerCellQuery extends PaginationQuery {
   name?: string;
   leader?: string;
   address?: string;
   meetingDay?: string;
   meetingTime?: string;
}

interface UserQuery extends PaginationQuery {
   search?: string;
   gender?: string;
   workforce?: string;
   maritalStatus?: string;
   department?: string;
   prayerCell?: string;
}

interface ProgramQuery extends PaginationQuery, DateRangeQuery {
   search?: string;
}

interface MessageQuery extends PaginationQuery, DateRangeQuery {
   title?: string;
}

interface ServiceReportQuery extends PaginationQuery, DateRangeQuery {}

interface QueryStore {
   query: Query;
   dateRangeQuery: DateRangeQuery;
   firstTimerQuery: FirstTimerQuery;
   prayerCellQuery: PrayerCellQuery;
   departmentQuery: DepartmentQuery;
   inventoryQuery: InventoryQuery;
   userQuery: UserQuery;
   messageQuery: MessageQuery;
   serviceReportQuery: ServiceReportQuery;
   programQuery: ProgramQuery;
   resetQuery: () => void;
   onSetProgram: (program: ProgramQuery) => void;
   onSetSearch: (search: string) => void;
   onSetServiceReport: (serviceReport: ServiceReportQuery) => void;
   onSetFirstTimer: (firstTimer: FirstTimerQuery) => void;
   onSetDepartment: (department: DepartmentQuery) => void;
   onSetInventory: (inventory: InventoryQuery) => void;
   onSetPrayerCell: (prayerCell: PrayerCellQuery) => void;
   onSetMessage: (message: MessageQuery) => void;
   onSetUser: (user: UserQuery) => void;
   onSetDateRange: (dateRange: DateRangeQuery) => void;
   onSetPageNumber: (pageNumber: number) => void;
   onSetPageSize: (pageSize: number) => void;
   onSetField: (field: string) => void;
}

const defaultStore = {
   query: {
      pageNumber: 1,
      pageSize: 10,
   },
   dateRangeQuery: {
      startDate: dayjs().startOf('month').toDate(),
      endDate: dayjs().endOf('month').toDate(),
   },
   firstTimerQuery: {
      dateJoinedStart: dayjs().startOf('month').toDate(),
      dateJoinedEnd: dayjs().endOf('month').toDate(),
   },
   inventoryQuery: {
      datePurchasedStart: dayjs().startOf('year').toDate(),
      datePurchasedEnd: dayjs().endOf('year').toDate(),
      minPrice: 0,
      maxPrice: 6_000_000,
   },
   serviceReportQuery: {
      startDate: dayjs().startOf('year').toDate(),
      endDate: dayjs().endOf('year').toDate(),
   },
   messageQuery: {
      startDate: dayjs().startOf('year').toDate(),
      endDate: dayjs().endOf('year').toDate(),
   },
   programQuery: {
      startDate: dayjs().startOf('month').toDate(),
      endDate: dayjs().endOf('month').toDate(),
   },
   prayerCellQuery: {},
   departmentQuery: {},
   userQuery: {},
};

const useQueryStore = create<QueryStore>((set) => ({
   ...defaultStore,
   resetQuery: () => set(() => ({ ...defaultStore })),
   onSetProgram: (program) => set((store) => ({ programQuery: { ...store.programQuery, ...program } })),
   onSetPrayerCell: (prayerCell) => set((store) => ({ prayerCellQuery: { ...store.prayerCellQuery, ...prayerCell } })),
   onSetServiceReport: (serviceReport) => set((store) => ({ serviceReportQuery: { ...store.serviceReportQuery, ...serviceReport } })),
   onSetMessage: (message) => set((store) => ({ messageQuery: { ...store.messageQuery, ...message } })),
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

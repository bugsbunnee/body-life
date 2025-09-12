import { create } from 'zustand';

interface UserQuery {
   search?: string;
   field?: string;
   pageNumber?: number;
   pageSize?: number;
}

interface UserStore {
   query: UserQuery;
   onSetSearch: (search: string) => void;
   onSetPageNumber: (pageNumber: number) => void;
   onSetPageSize: (pageSize: number) => void;
   onSetField: (field: string) => void;
}

const useUserStore = create<UserStore>((set) => ({
   query: {
      pageNumber: 1,
      pageSize: 10,
   },
   onSetField: (field) => set((store) => ({ query: { ...store.query, field } })),
   onSetPageNumber: (pageNumber) => set((store) => ({ query: { ...store.query, pageNumber } })),
   onSetPageSize: (pageSize) => set((store) => ({ query: { ...store.query, pageSize } })),
   onSetSearch: (search) => set((store) => ({ query: { ...store.query, search } })),
}));

export default useUserStore;

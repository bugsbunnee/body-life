import { create } from 'zustand';

interface Query {
   search?: string;
   field?: string;
   pageNumber?: number;
   pageSize?: number;
}

interface QueryStore {
   query: Query;
   resetQuery: () => void;
   onSetSearch: (search: string) => void;
   onSetPageNumber: (pageNumber: number) => void;
   onSetPageSize: (pageSize: number) => void;
   onSetField: (field: string) => void;
}

const useQueryStore = create<QueryStore>((set) => ({
   query: {
      pageNumber: 1,
      pageSize: 10,
   },
   resetQuery: () => set(() => ({ query: {} })),
   onSetField: (field) => set((store) => ({ query: { ...store.query, field } })),
   onSetPageNumber: (pageNumber) => set((store) => ({ query: { ...store.query, pageNumber } })),
   onSetPageSize: (pageSize) => set((store) => ({ query: { ...store.query, pageSize } })),
   onSetSearch: (search) => set((store) => ({ query: { ...store.query, search } })),
}));

export default useQueryStore;

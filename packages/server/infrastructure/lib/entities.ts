export interface Pagination {
   pageNumber: number;
   pageSize: number;
   offset: number;
}

export interface SearchFilter<T> {
   search?: string;
   field?: keyof T;
}

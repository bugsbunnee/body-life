import type { IconType } from 'react-icons/lib';

export interface ApiResponse<T> {
   data: T[];
   pagination: {
      pageNumber: number;
      pageSize: number;
      totalPages: number;
      totalCount: number;
   };
}

export interface AuthResponse {
   token: string;
   user: null;
}

export interface IMessage {
   id: number;

   title: string;
   date: Date;
   preacher: string;
   videoUrl: string;

   summary?: ISummary;
}

export interface ISummary {
   id: number;
   content: string;
   transcript: string;
   generatedAt: Date;
   expiresAt: Date;
}

export interface PaginationProps {
   pageNumber: number;
   pageSize: number;
   totalCount: number;
   totalPages: number;
}

export interface Route {
   path: string;
   label: string;
   subroutes: {
      Icon: IconType;
      path: string;
      label: string;
   }[];
}

export interface User {
   id: number;
   email: string;
   firstName: string;
   lastName: string;
   phoneNumber: string;
   address: string;
   birthDay: Date;
   createdAt: Date;
   updatedAt: Date;
   notes: string;
}

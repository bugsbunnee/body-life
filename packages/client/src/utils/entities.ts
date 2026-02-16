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

export interface Admin {
   imageUrl: string;
   firstName: string;
   lastName: string;
   designation: string;
   email: string;
   isActive: boolean;
   lastLoginAt: string;
}

export interface AuthResponse {
   token: string;
   tokenExpiresAt: Date;
   admin: Admin;
}

export interface FollowUp {
   _id: string;
   status: string;
   feedback: string;
   preferredContactMethod: string;
   user: Pick<User, '_id' | 'firstName' | 'lastName' | 'phoneNumber'>;
   service: Pick<ServiceReport, '_id' | 'serviceDate'>;
}

export interface IMessage {
   _id: string;

   title: string;
   date: Date;
   preacher: Pick<User, '_id' | 'firstName' | 'lastName'>;
   videoUrl: string;

   summary?: ISummary;
}

export interface ISummary {
   _id: string;
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

export interface ServiceReport {
   _id: string;
   message: Pick<IMessage, '_id' | 'title' | 'preacher'>;
   serviceDate: Date;
   prepPrayers: Pick<User, '_id' | 'firstName' | 'lastName'>;
   worship: Pick<User, '_id' | 'firstName' | 'lastName'>;
   seatArrangementCount: number;
   firstTimerCount: number;
   offering: number;
   totalAttendance: number;
   counts: {
      time: string;
      round: number;
      adults: number;
      children: number;
   }[];
}

export interface User {
   _id: string;
   email: string;
   firstName: string;
   lastName: string;
   phoneNumber: string;
   address: string;
   dateOfBirth: Date;
   isFirstTimer: boolean;
   createdAt: Date;
   updatedAt: Date;
   notes: string;
}

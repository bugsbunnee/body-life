import type { IconType } from 'react-icons/lib';

export enum UserRole {
   Pastor = 'pastor',
   Hod = 'hod',
   Worker = 'worker',
   Member = 'member',
   PrayerCellLeader = 'prayer-cell-leader',
   External = 'external',
}

export enum RequisitionStatus {
   Pending = 'pending',
   Approved = 'approved',
   Rejected = 'rejected',
   Disbursed = 'disbursed',
}

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
   tokenExpiresAt: Date;
   admin: User;
}

export interface Department {
   _id: string;
   name: string;
   hod: Pick<User, '_id' | 'firstName' | 'lastName' | 'phoneNumber'>;
   totalMembership: number;
}

export interface InventoryItem {
   _id: string;
   name: string;
   quantity: number;
   department: Pick<Department, '_id' | 'name'>;
   unitPrice: number;
   datePurchased: Date;
   description: string;
}

export interface FollowUp {
   _id: string;
   status: string;
   feedback: string;
   preferredContactMethod: string;
   assignedTo: Pick<User, '_id' | 'firstName' | 'lastName' | 'phoneNumber'>;
   user: Pick<User, '_id' | 'firstName' | 'lastName' | 'phoneNumber'>;
   service: Pick<ServiceReport, '_id' | 'serviceDate'>;
}

export interface FollowUpAttempt {
   _id: string;
   channel: string;
   contactedAt: Date;
   contactedBy: Pick<User, '_id' | 'firstName' | 'lastName' | 'phoneNumber'>;
   response: string;
   successful: boolean;
}

export interface FirstTimer {
   _id: string;
   status: string;
   feedback: string;
   preferredContactMethod: string;
   assignedTo: Pick<User, '_id' | 'firstName' | 'lastName' | 'phoneNumber'>;
   user: Pick<User, '_id' | 'firstName' | 'lastName' | 'phoneNumber'>;
   serviceAttended: Pick<ServiceReport, '_id' | 'serviceDate'>;
   attempts: FollowUpAttempt[];
   wantsToJoinDepartment: boolean;
   nextActionAt: Date;
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

export interface PrayerCell {
   _id: string;
   name: string;
   meetingDay: string;
   meetingTime: string;
   address: string;
   leader: Pick<User, '_id' | 'firstName' | 'lastName'>;
   totalMembership: number;
}

export interface PaginationProps {
   pageNumber: number;
   pageSize: number;
   totalCount: number;
   totalPages: number;
}

export interface Program {
   _id: string;
   imageUrl: string;
   title: string;
   description: string;
   address: string;
   scheduledFor: Date;
   isActive: boolean;
   isUpcoming: boolean;
}

export interface Requisition {
   _id: string;
   description: string;
   amount: number;
   createdAt: Date;
   department: Pick<Department, '_id' | 'name'>;
   requester: Pick<User, '_id' | 'firstName' | 'lastName'>;
   actioner?: Pick<User, '_id' | 'firstName' | 'lastName'>;
   status: string;
   approvedAt?: Date;
   rejectedAt?: Date;
   disbursedAt?: Date;
}

export interface RouteItem {
   Icon: IconType;
   path: string;
   label: string;
   permittedRoles: UserRole[];
}

export interface SubRoute {
   Icon: IconType;
   path: string;
   label: string;
   subroutes: RouteItem[];
   permittedRoles?: UserRole[];
}

export interface Route {
   path: string;
   label: string;
   subroutes: SubRoute[];
}

export interface PickerOption {
   label: string;
   value: string;
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
   imageUrl: string;
   _id: string;
   email: string;
   firstName: string;
   lastName: string;
   phoneNumber: string;
   address: string;
   dateOfBirth: Date;
   gender: string;
   maritalStatus: string;
   department?: Pick<Department, '_id' | 'name'> | null;
   prayerCell?: Pick<PrayerCell, '_id' | 'name'>;
   isFirstTimer: boolean;
   isAdmin: boolean;
   userRole: UserRole;
   createdAt: Date;
   updatedAt: Date;
   notes: string;
}

export interface WeeklyReview {
   department: Pick<Department, '_id' | 'name'>;
   serviceReport: Pick<ServiceReport, '_id' | 'serviceDate'>;
   submittedBy: Pick<User, '_id' | 'firstName' | 'lastName'>;
   submittedAt: Date;
   feedback?: string | null;
   feedbackDueForActionAt?: Date | null;
   fields: Array<{
      value: string;
      label: string;
   }>;
}

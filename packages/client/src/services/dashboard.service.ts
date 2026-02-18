import http from './http.service';

import { formatDate } from 'date-fns';

import type { ApiResponse, FollowUp, ServiceReport, User } from '@/utils/entities';
import type { IServiceReport } from '@/components/forms/service-report/service-report-schema';

type ServiceItem = {
   current: number;
   trend: 'increment' | 'decrement' | 'same';
   difference: string;
};

type AttendanceTrend = {
   serviceDate: string;
   totalAttendance: number;
};

type ServiceOverview = {
   attendanceTrend: AttendanceTrend[];
   userBirthdays: ApiResponse<User>;
   uncontactedFirstTimers: FollowUp[];
   prayerCellInsights: {
      totalPrayerCells: ServiceItem;
   };
   userInsights: {
      totalUsers: ServiceItem;
      totalWorkforce: ServiceItem;
      totalNonWorkforce: ServiceItem;
   };
   firstTimerInsights: {
      totalFirstTimers: ServiceItem;
      uncontactedFirstTimers: ServiceItem;
      overdueFollowUp: ServiceItem;
      contactsMade: ServiceItem;
   };
   metadata: {
      currentStartDate: string;
      currentEndDate: string;
      durationLabel: string;
      differenceInDays: number;
      previousStartDate: string;
      previousEndDate: string;
   };
};

export const getServiceOverview = (startDate: Date, endDate: Date) => {
   const actualStartDate = formatDate(startDate, 'yyyy-MM-dd');
   const actualEndDate = formatDate(endDate, 'yyyy-MM-dd');

   return http.get<ServiceOverview>('/api/service-report/overview', { params: { startDate: actualStartDate, endDate: actualEndDate } }).then((response) => response.data);
};

export const getServiceReports = (startDate: Date, endDate: Date) => {
   const actualStartDate = formatDate(startDate, 'yyyy-MM-dd');
   const actualEndDate = formatDate(endDate, 'yyyy-MM-dd');

   return http.get<ApiResponse<ServiceReport>>('/api/service-report', { params: { startDate: actualStartDate, endDate: actualEndDate } }).then((response) => response.data);
};

export const createServiceReport = (serviceReport: IServiceReport) => {
   return http.post<ServiceReport>('/api/service-report', serviceReport).then((response) => response.data);
};

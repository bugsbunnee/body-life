import axios from 'axios';

import type { DateRange } from 'react-day-picker';

import { clsx, type ClassValue } from 'clsx';
import { format, isSameMonth, isSameYear } from 'date-fns';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
   return twMerge(clsx(inputs));
}

export function getInitials(text: string) {
   return text
      .split(' ')
      .map((word) => word.charAt(0))
      .join('')
      .toUpperCase();
}

export function getErrorMessage(error: unknown) {
   if (axios.isAxiosError(error)) {
      return error.response!.data!.message ?? error.message;
   }

   return (<Error>error).message;
}

export function formatAmount(amount: number) {
   return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'NGN' }).format(amount);
}

export function formatDateRange(dateRange: DateRange) {
   if (isSameMonth(dateRange.from!, dateRange.to!)) {
      return `${format(dateRange.from!, 'MMM d')}-${format(dateRange.to!, 'd')}`;
   }

   if (isSameYear(dateRange.from!, dateRange.to!)) {
      return `${format(dateRange.from!, 'MMM d')} - ${format(dateRange.to!, 'MMM d')}`;
   }

   return `${format(dateRange.from!, 'MMM d, yyyy')} - ${format(dateRange.to!, 'MMM d, yyyy')}`;
}

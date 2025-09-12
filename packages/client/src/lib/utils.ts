import axios from 'axios';
import { clsx, type ClassValue } from 'clsx';
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
      return error.response!.data!.error ?? error.message;
   }

   return (<Error>error).message;
}

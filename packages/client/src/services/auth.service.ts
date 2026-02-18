import type { AuthResponse } from '../utils/entities';
import http from './http.service';

export const authenticate = (email: string, password: string) => {
   return http.post<AuthResponse>('/api/auth/admin', {
      email,
      password,
   });
};

export const updatePassword = <T>(credentials: T) => {
   return http.post<{ message: string }>('/api/auth/admin/password', credentials);
};

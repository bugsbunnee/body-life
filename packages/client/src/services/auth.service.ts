import type { AuthResponse } from '../utils/entities';
import http, { signRequests } from './http.service';
import Cookies from 'js-cookie';

const key = 'auth-user';

export const authenticate = (email: string, password: string) => {
   return http.post<AuthResponse>('/api/v1/auth/admin/login', {
      email,
      password,
   });
};

export const updatePassword = <T>(credentials: T) => {
   return http.post<{ message: string }>('/api/v1/auth/update-password', credentials);
};

export const persistUser = (authResponse: AuthResponse) => {
   Cookies.set(key, JSON.stringify(authResponse), { expires: 7 });
};

export const logout = () => {
   Cookies.remove(key);
};

export const getUser = () => {
   const result = Cookies.get(key);
   return result ? JSON.parse(result) : null;
};

const user = getUser();
if (user) signRequests(user.token);

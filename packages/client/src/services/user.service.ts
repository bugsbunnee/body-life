import type { AuthResponse } from '@/utils/entities';
import Cookies from 'js-cookie';

const key = 'auth-user';

export const persistUser = (authResponse: AuthResponse) => {
   Cookies.set(key, JSON.stringify(authResponse), { expires: 7 });
};

export const logout = () => {
   Cookies.remove(key);
};

export const getUser = () => {
   const result = Cookies.get(key);
   return result ? (JSON.parse(result) as AuthResponse) : null;
};

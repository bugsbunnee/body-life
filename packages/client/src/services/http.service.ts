import axios, { HttpStatusCode } from 'axios';

import { getUser, logout } from './user.service';
import { APP_ROUTES } from '@/utils/constants';

const http = axios.create({
   baseURL: import.meta.env.VITE_API_URL,
   withCredentials: true,
});

http.interceptors.request.use((config) => {
   const user = getUser();

   if (user) {
      config.headers['x-auth-token'] = user.token;
   }

   return config;
});

http.interceptors.response.use(
   (response) => response,
   (error) => {
      if (error.response && error.response.status === HttpStatusCode.Forbidden) {
         logout();
         window.location.href = APP_ROUTES.AUTH;
      }

      return Promise.reject(error);
   }
);

export default http;

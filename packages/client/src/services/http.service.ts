import axios from 'axios';
import { getUser } from './user.service';

const http = axios.create({
   baseURL: import.meta.env.VITE_APP_BASE_URL,
});

http.interceptors.request.use((config) => {
   const user = getUser();

   if (user) {
      config.headers['x-auth-token'] = user.token;
   }

   return config;
});

export default http;

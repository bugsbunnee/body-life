import axios from 'axios';

const http = axios.create({
   baseURL: import.meta.env.VITE_APP_BASE_URL,
});

const signRequests = (token: string) => {
   http.defaults.headers.common['x-auth-token'] = token;
};

export { signRequests };
export default http;

import type { IconType } from 'react-icons/lib';

export interface AuthResponse {
   token: string;
   user: null;
}

export interface Route {
   path: string;
   label: string;
   subroutes: {
      Icon: IconType;
      path: string;
      label: string;
   }[];
}

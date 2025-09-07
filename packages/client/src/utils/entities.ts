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

export interface User {
   id: number;
   email: string;
   firstName: string;
   lastName: string;
   phoneNumber: string;
   address: string;
   birthDay: Date;
   createdAt: Date;
   updatedAt: Date;
}

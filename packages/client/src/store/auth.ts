import { create } from 'zustand';
import { getUser, logout, persistUser } from '../services/auth.service';

import type { AuthResponse } from '../utils/entities';

interface AuthStore {
   auth: AuthResponse | null;
   login: (auth: AuthResponse) => void;
   logout: () => void;
}

const useAuthStore = create<AuthStore>((set) => ({
   auth: getUser(),
   login: (auth) => {
      set(() => ({ auth }));
      persistUser(auth);
   },
   logout: () => {
      set(() => ({ auth: null }));
      logout();
   },
}));

export default useAuthStore;

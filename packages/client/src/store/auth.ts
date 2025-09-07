import type { AuthResponse } from '../utils/entities';
import { create } from 'zustand';
import { getUser, logout, persistUser } from '../services/auth.service';

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

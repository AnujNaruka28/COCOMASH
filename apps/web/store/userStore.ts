import { create } from 'zustand';

interface User {
  id: string;
  name: string;
  email?: string | null;
  profile_url?: string | null;
}

interface UserStore {
  user: User | null;
  userId: string | null;
  setUser: (user: User) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  userId: null,
  setUser: (user) => set({ user, userId: user.id }),
  clearUser: () => set({ user: null, userId: null }),
}));

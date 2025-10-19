import { create } from 'zustand';

interface User {
  id: number;
  email: string;
  name: string;
  birthDate: string;
  nickName: string;
  bio: string;
  profileImage: string;
}

interface AuthState {
  isLoggedIn: boolean;
  isLoading: boolean;
  hasChecked: boolean;
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
  checkLoginStatus: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  isLoggedIn: false,
  isLoading: true,
  hasChecked: false,
  user: null,

  setUser: user => set({ user, isLoggedIn: Boolean(user) }),

  logout: () => set({ user: null, isLoggedIn: false }),

  checkLoginStatus: async () => {
    if (get().hasChecked) {
      return;
    }

    set({ isLoading: true });

    try {
      const token = localStorage.getItem('accessToken');
      const user = get().user;

      if (token && user) {
        set({ isLoggedIn: true, hasChecked: true, isLoading: false });
      } else {
        set({
          isLoggedIn: false,
          isLoading: false,
          hasChecked: true,
        });
      }
    } catch {
      set({
        isLoggedIn: false,
        isLoading: false,
        hasChecked: true,
      });
    }
  },
}));

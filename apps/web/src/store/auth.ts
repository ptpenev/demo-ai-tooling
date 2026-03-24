import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { apiClient } from '../api/client';

export interface UserProfile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  is_active: boolean;
}

export interface Permission {
  action: string;
  resource: string;
  scope: string;
}

interface AuthState {
  token: string | null;
  user: UserProfile | null;
  permissions: Permission[];
  isAuthenticated: boolean;
  setAuth: (token: string, user: UserProfile) => void;
  setPermissions: (permissions: Permission[]) => void;
  logout: () => void;
  fetchProfile: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      permissions: [],
      isAuthenticated: false,
      setAuth: (token, user) => set({ token, user, isAuthenticated: true }),
      setPermissions: (permissions) => set({ permissions }),
      logout: () => {
        set({ token: null, user: null, permissions: [], isAuthenticated: false });
        // Can redirect or clean other storages
      },
      fetchProfile: async () => {
        try {
          const res = await apiClient.get('/users/me');
          set({ 
            user: res.data.data.profile, 
            permissions: res.data.data.permissions 
          });
        } catch (error) {
          get().logout();
        }
      }
    }),
    {
      name: 'auth-storage',
      // Only persist token and basic user info, we can refetch permissions
      partialize: (state) => ({ token: state.token, user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);

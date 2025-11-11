import { create } from 'zustand';
import { User } from '@/types/models';
import { StorageService } from '@/services/storage';
import { AuditService } from '@/services/audit';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: StorageService.get('currentUser'),
  isAuthenticated: !!StorageService.get('currentUser'),

  login: async (email: string, password: string) => {
    const users = StorageService.get<User[]>('users') || [];
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
      const updatedUser = {
        ...user,
        lastLoginAt: new Date().toISOString(),
      };
      
      const userIndex = users.findIndex(u => u.id === user.id);
      users[userIndex] = updatedUser;
      StorageService.set('users', users);
      StorageService.set('currentUser', updatedUser);
      
      set({ user: updatedUser, isAuthenticated: true });
      AuditService.log(user.id, 'login', 'User');
      
      return true;
    }

    return false;
  },

  logout: () => {
    StorageService.remove('currentUser');
    set({ user: null, isAuthenticated: false });
  },

  updateUser: (updates: Partial<User>) => {
    const { user } = get();
    if (user) {
      const updatedUser = { ...user, ...updates };
      StorageService.set('currentUser', updatedUser);
      set({ user: updatedUser });
    }
  },
}));

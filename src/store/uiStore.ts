import { create } from 'zustand';

interface UIState {
  sidebarOpen: boolean;
  theme: 'light' | 'dark';
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
}

// Check if we're on mobile on initial load
const isMobile = () => typeof window !== 'undefined' && window.innerWidth < 1024;

export const useUIStore = create<UIState>((set) => ({
  // Default: closed on mobile, open on desktop
  sidebarOpen: !isMobile(),
  theme: 'light',

  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open: boolean) => set({ sidebarOpen: open }),
  
  toggleTheme: () => set((state) => {
    const newTheme = state.theme === 'light' ? 'dark' : 'light';
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
    return { theme: newTheme };
  }),
  
  setTheme: (theme: 'light' | 'dark') => set({ theme }),
}));

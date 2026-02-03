import * as React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  Map,
  MapPin,
  Bell,
  FileText,
  UserCog,
  Activity,
  Shield,
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useUIStore } from '@/store/uiStore';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Dashboard', href: '/app/dashboard', icon: LayoutDashboard, roles: ['SuperAdmin', 'AdminSatuan', 'Operator', 'Viewer', 'Puskesau'] },
  { name: 'Personel', href: '/app/personel', icon: Users, roles: ['SuperAdmin', 'AdminSatuan', 'Operator', 'Viewer'] },
  { name: 'Pendidikan & Pelatihan', href: '/app/pelatihan', icon: GraduationCap, roles: ['SuperAdmin', 'AdminSatuan', 'Operator', 'Viewer'] },
  { name: 'Peta', href: '/app/peta', icon: Map, roles: ['SuperAdmin', 'AdminSatuan', 'Operator', 'Viewer'] },
  { name: 'Peta Sebaran', href: '/app/peta-sebaran', icon: MapPin, roles: ['SuperAdmin', 'AdminSatuan', 'Operator', 'Viewer'] },
  { name: 'E-RM', href: '/app/erm', icon: Activity, roles: ['SuperAdmin', 'AdminSatuan', 'Operator'] },
  { name: 'Portal Faskes', href: '/app/erm', icon: Shield, roles: ['Puskesau'] },
  { name: 'Notifikasi', href: '/app/notifikasi', icon: Bell, roles: ['SuperAdmin', 'AdminSatuan', 'Operator', 'Viewer', 'Puskesau'] },
  { name: 'Log Aktivitas', href: '/app/log', icon: FileText, roles: ['SuperAdmin', 'AdminSatuan'] },
  { name: 'Manajemen User', href: '/app/users', icon: UserCog, roles: ['SuperAdmin'] },
];

export function Sidebar() {
  const location = useLocation();
  const { user } = useAuthStore();
  const { sidebarOpen, setSidebarOpen } = useUIStore();

  const filteredNavigation = navigation.filter(item =>
    user?.role && item.roles.includes(user.role)
  );

  // Close sidebar on mobile when route changes
  React.useEffect(() => {
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  }, [location.pathname, setSidebarOpen]);

  return (
    <div
      className={cn(
        'fixed inset-y-0 left-0 z-50 flex flex-col bg-slate-900 text-white transition-all duration-300',
        // Mobile: slide from left
        'transform lg:transform-none',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        // Desktop: width based on state
        'lg:w-20',
        sidebarOpen && 'lg:w-64',
        // Mobile: always full width when open
        'w-64'
      )}
    >
      <div className="flex h-16 items-center justify-center border-b border-slate-800 px-4">
        <h1 className={cn(
          'font-bold transition-all',
          'text-xl lg:text-xl',
          !sidebarOpen && 'lg:text-sm'
        )}>
          {/* Mobile: Always show full name, Desktop: Toggle based on sidebar state */}
          <span className="lg:hidden">BINPROFKES</span>
          <span className="hidden lg:inline">{sidebarOpen ? 'BINPROFKES' : 'BP'}</span>
        </h1>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {filteredNavigation.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href;
          
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-3 lg:py-2 text-sm font-medium transition-colors',
                'min-h-[44px]', // Touch target size for mobile
                isActive
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              )}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              {/* Mobile: Always show text, Desktop: Toggle based on sidebar state */}
              <span className="lg:hidden">{item.name}</span>
              {sidebarOpen && <span className="hidden lg:inline">{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-slate-800 p-4">
        <div className={cn(
          'flex items-center gap-3',
          !sidebarOpen && 'justify-center'
        )}>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-700">
            {user?.name.charAt(0) || 'U'}
          </div>
          {sidebarOpen && (
            <div className="flex-1 overflow-hidden">
              <p className="truncate text-sm font-medium">{user?.name}</p>
              <p className="truncate text-xs text-slate-400">{user?.role}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

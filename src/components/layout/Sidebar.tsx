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
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useUIStore } from '@/store/uiStore';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Dashboard', href: '/app/dashboard', icon: LayoutDashboard, roles: ['SuperAdmin', 'AdminSatuan', 'Operator', 'Viewer'] },
  { name: 'Personel', href: '/app/personel', icon: Users, roles: ['SuperAdmin', 'AdminSatuan', 'Operator', 'Viewer'] },
  { name: 'Pelatihan', href: '/app/pelatihan', icon: GraduationCap, roles: ['SuperAdmin', 'AdminSatuan', 'Operator', 'Viewer'] },
  { name: 'Peta', href: '/app/peta', icon: Map, roles: ['SuperAdmin', 'AdminSatuan', 'Operator', 'Viewer'] },
  { name: 'Peta Sebaran', href: '/app/peta-sebaran', icon: MapPin, roles: ['SuperAdmin', 'AdminSatuan', 'Operator', 'Viewer'] },
  { name: 'Notifikasi', href: '/app/notifikasi', icon: Bell, roles: ['SuperAdmin', 'AdminSatuan', 'Operator', 'Viewer'] },
  { name: 'Log Aktivitas', href: '/app/log', icon: FileText, roles: ['SuperAdmin', 'AdminSatuan'] },
  { name: 'Manajemen User', href: '/app/users', icon: UserCog, roles: ['SuperAdmin'] },
];

export function Sidebar() {
  const location = useLocation();
  const { user } = useAuthStore();
  const { sidebarOpen } = useUIStore();

  const filteredNavigation = navigation.filter(item =>
    user?.role && item.roles.includes(user.role)
  );

  return (
    <div
      className={cn(
        'fixed inset-y-0 left-0 z-50 flex flex-col bg-slate-900 text-white transition-all duration-300',
        sidebarOpen ? 'w-64' : 'w-20'
      )}
    >
      <div className="flex h-16 items-center justify-center border-b border-slate-800 px-4">
        <h1 className={cn(
          'font-bold text-xl transition-all',
          !sidebarOpen && 'text-sm'
        )}>
          {sidebarOpen ? 'BINPROFKES' : 'BP'}
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
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              )}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              {sidebarOpen && <span>{item.name}</span>}
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

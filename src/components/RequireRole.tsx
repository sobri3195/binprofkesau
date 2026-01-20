import type { ReactNode } from 'react';
import { useAuthStore } from '@/store/authStore';
import { Role } from '@/types/models';

interface RequireRoleProps {
  roles: Role[];
  children: ReactNode;
  fallback?: ReactNode;
}

export function RequireRole({ roles, children, fallback = null }: RequireRoleProps) {
  const { user } = useAuthStore();

  if (!user || !roles.includes(user.role)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingProps {
  className?: string;
  text?: string;
}

export function Loading({ className, text = 'Memuat...' }: LoadingProps) {
  return (
    <div className={cn('flex items-center justify-center gap-2', className)}>
      <Loader2 className="h-5 w-5 animate-spin" />
      {text && <span className="text-sm text-muted-foreground">{text}</span>}
    </div>
  );
}

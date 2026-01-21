import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Notifikasi, KategoriNotifikasi } from '@/types/models';
import { StorageService } from '@/services/storage';
import { format } from 'date-fns';
import { Bell, Check } from 'lucide-react';

export function NotifikasiPage() {
  const [notifikasi, setNotifikasi] = useState<Notifikasi[]>(
    StorageService.get<Notifikasi[]>('notifikasi') || []
  );
  const [filter, setFilter] = useState<KategoriNotifikasi | ''>('');

  const filteredNotifikasi = notifikasi.filter(n => !filter || n.kategori === filter);

  const handleMarkAsRead = (id: string) => {
    const updated = notifikasi.map(n =>
      n.id === id ? { ...n, dibaca: true } : n
    );
    setNotifikasi(updated);
    StorageService.set('notifikasi', updated);
  };

  const handleMarkAllAsRead = () => {
    const updated = notifikasi.map(n => ({ ...n, dibaca: true }));
    setNotifikasi(updated);
    StorageService.set('notifikasi', updated);
  };

  const unreadCount = notifikasi.filter(n => !n.dibaca).length;

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Notifikasi</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            {unreadCount} notifikasi belum dibaca
          </p>
        </div>
        {unreadCount > 0 && (
          <Button onClick={handleMarkAllAsRead} className="w-full sm:w-auto">
            <Check className="mr-2 h-4 w-4" />
            Tandai Semua Dibaca
          </Button>
        )}
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        <Button
          variant={filter === '' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('')}
          className="shrink-0"
        >
          Semua
        </Button>
        {(['Informasi', 'Peringatan', 'Pembaruan', 'Belum sekolah', 'Belum pindah', 'Belum PPDS'] as KategoriNotifikasi[]).map(kat => (
          <Button
            key={kat}
            variant={filter === kat ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter(kat)}
            className="shrink-0"
          >
            {kat}
          </Button>
        ))}
      </div>

      <div className="space-y-4">
        {filteredNotifikasi.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              Tidak ada notifikasi
            </CardContent>
          </Card>
        ) : (
          filteredNotifikasi.map((n) => (
            <Card key={n.id} className={n.dibaca ? 'opacity-60' : ''}>
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {!n.dibaca && (
                        <Bell className="h-4 w-4 text-blue-500" />
                      )}
                      <CardTitle className="text-base">{n.judul}</CardTitle>
                    </div>
                    <Badge
                      variant={
                        n.kategori === 'Peringatan' ? 'destructive' :
                        n.kategori === 'Pembaruan' ? 'success' :
                        'secondary'
                      }
                    >
                      {n.kategori}
                    </Badge>
                  </div>
                  {!n.dibaca && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleMarkAsRead(n.id)}
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-2">{n.isi}</p>
                <p className="text-xs text-muted-foreground">
                  {format(new Date(n.createdAt), 'dd MMM yyyy HH:mm')}
                </p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

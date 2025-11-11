import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AuditLog, User } from '@/types/models';
import { AuditService } from '@/services/audit';
import { StorageService } from '@/services/storage';
import { ExportService } from '@/services/export';
import { format } from 'date-fns';
import { Download } from 'lucide-react';

export function LogAktivitasPage() {
  const [logs] = useState<AuditLog[]>(AuditService.getLogs());
  const [users] = useState<User[]>(StorageService.get<User[]>('users') || []);

  const logsWithUserNames = useMemo(() => {
    return logs.map(log => {
      const user = users.find(u => u.id === log.userId);
      return {
        ...log,
        userName: user?.name || 'Unknown',
        userEmail: user?.email || 'Unknown',
      };
    }).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [logs, users]);

  const handleExport = () => {
    ExportService.exportToCSV(
      logsWithUserNames,
      'audit-log-binprofkes',
      ['timestamp', 'userName', 'userEmail', 'aksi', 'entitas', 'entitasId']
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Log Aktivitas</h1>
          <p className="text-muted-foreground">
            Riwayat aktivitas pengguna sistem
          </p>
        </div>
        <Button onClick={handleExport}>
          <Download className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Audit Trail</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium">Waktu</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">User</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Aksi</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Entitas</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">ID Entitas</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {logsWithUserNames.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-sm text-muted-foreground">
                        Tidak ada log aktivitas
                      </td>
                    </tr>
                  ) : (
                    logsWithUserNames.map((log) => (
                      <tr key={log.id} className="hover:bg-muted/50">
                        <td className="px-4 py-3 text-sm">
                          {format(new Date(log.timestamp), 'dd MMM yyyy HH:mm:ss')}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <div>
                            <p className="font-medium">{log.userName}</p>
                            <p className="text-xs text-muted-foreground">{log.userEmail}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <Badge
                            variant={
                              log.aksi === 'create' ? 'success' :
                              log.aksi === 'update' ? 'default' :
                              log.aksi === 'delete' ? 'destructive' :
                              'secondary'
                            }
                          >
                            {log.aksi}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-sm">{log.entitas}</td>
                        <td className="px-4 py-3 text-sm font-mono text-xs">
                          {log.entitasId || '-'}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

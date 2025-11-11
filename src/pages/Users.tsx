import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { User } from '@/types/models';
import { StorageService } from '@/services/storage';
import { format } from 'date-fns';
import { Plus, Pencil, Trash2 } from 'lucide-react';

export function UsersPage() {
  const [users, setUsers] = useState<User[]>(StorageService.get<User[]>('users') || []);

  const handleDelete = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus user ini?')) {
      const filtered = users.filter(u => u.id !== id);
      setUsers(filtered);
      StorageService.set('users', filtered);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Manajemen User</h1>
          <p className="text-muted-foreground">
            Kelola akses pengguna sistem
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Tambah User
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar User</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium">Nama</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Email</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Role</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Satuan</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Last Login</th>
                    <th className="px-4 py-3 text-right text-sm font-medium">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-muted/50">
                      <td className="px-4 py-3 text-sm font-medium">{user.name}</td>
                      <td className="px-4 py-3 text-sm">{user.email}</td>
                      <td className="px-4 py-3 text-sm">
                        <Badge
                          variant={
                            user.role === 'SuperAdmin' ? 'destructive' :
                            user.role === 'AdminSatuan' ? 'default' :
                            'secondary'
                          }
                        >
                          {user.role}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-sm">{user.satuan || '-'}</td>
                      <td className="px-4 py-3 text-sm">
                        {user.lastLoginAt
                          ? format(new Date(user.lastLoginAt), 'dd MMM yyyy HH:mm')
                          : '-'}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm">
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(user.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

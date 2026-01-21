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
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Manajemen User</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Kelola akses pengguna sistem
          </p>
        </div>
        <Button className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          Tambah User
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar User</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Desktop Table */}
          <div className="hidden md:block rounded-md border">
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

          {/* Mobile Cards */}
          <div className="md:hidden space-y-3">
            {users.length === 0 ? (
              <div className="text-center py-8 text-sm text-muted-foreground">
                Tidak ada data user
              </div>
            ) : (
              users.map((user) => (
                <Card key={user.id}>
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-gray-900">{user.name}</h3>
                          <p className="text-sm text-gray-500 truncate">{user.email}</p>
                        </div>
                        <Badge
                          variant={
                            user.role === 'SuperAdmin' ? 'destructive' :
                            user.role === 'AdminSatuan' ? 'default' :
                            'secondary'
                          }
                          className="shrink-0 text-xs"
                        >
                          {user.role}
                        </Badge>
                      </div>

                      <div className="space-y-2 text-sm">
                        {user.satuan && (
                          <div>
                            <span className="text-gray-500">Satuan:</span>
                            <p className="font-medium text-gray-900">{user.satuan}</p>
                          </div>
                        )}
                        <div>
                          <span className="text-gray-500">Last Login:</span>
                          <p className="font-medium text-gray-900">
                            {user.lastLoginAt
                              ? format(new Date(user.lastLoginAt), 'dd MMM yyyy HH:mm')
                              : '-'}
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-2 pt-2 border-t">
                        <Button variant="outline" size="sm" className="flex-1">
                          <Pencil className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(user.id)}
                          className="flex-1 text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Hapus
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

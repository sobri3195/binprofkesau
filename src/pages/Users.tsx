import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { User } from '@/types/models';
import { Repository } from '@/services/repository';
import { ExportService } from '@/services/export';
import { useAuthStore } from '@/store/authStore';
import { format } from 'date-fns';
import { Download, Plus, Pencil, Trash2 } from 'lucide-react';
import { UserFormModal, UserFormData } from '@/components/users/UserFormModal';

const userRepo = new Repository<User>('users', 'User');

export function UsersPage() {
  const { user: currentUser } = useAuthStore();
  const [users, setUsers] = useState<User[]>(userRepo.getAll());
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const handleDelete = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus user ini?')) {
      userRepo.delete(id, currentUser?.id ?? 'system');
      setUsers(userRepo.getAll());
    }
  };

  const handleAdd = () => {
    setEditingUser(null);
    setIsFormModalOpen(true);
  };

  const handleEdit = (selectedUser: User) => {
    setEditingUser(selectedUser);
    setIsFormModalOpen(true);
  };

  const handleFormSubmit = (data: UserFormData) => {
    if (editingUser) {
      const updates: Partial<User> = {
        name: data.name,
        email: data.email,
        role: data.role,
        satuan: data.satuan,
      };

      if (data.password) {
        updates.password = data.password;
      }

      userRepo.update(editingUser.id, updates, currentUser?.id ?? 'system');
    } else {
      userRepo.create(
        {
          name: data.name,
          email: data.email,
          password: data.password || 'admin123',
          role: data.role,
          satuan: data.satuan,
          lastLoginAt: undefined,
        },
        currentUser?.id ?? 'system'
      );
    }

    setUsers(userRepo.getAll());
    setIsFormModalOpen(false);
    setEditingUser(null);
  };

  const handleExportCSV = () => {
    ExportService.exportToCSV(users, 'users-binprofkes', [
      'name',
      'email',
      'role',
      'satuan',
      'lastLoginAt',
    ]);
  };

  const handleExportExcel = () => {
    ExportService.exportToExcel(users, 'users-binprofkes', [
      'name',
      'email',
      'role',
      'satuan',
      'lastLoginAt',
    ]);
  };

  const handleExportPDF = () => {
    ExportService.exportToPDF(users, 'User BINPROFKES', [
      { header: 'Nama', dataKey: 'name' },
      { header: 'Email', dataKey: 'email' },
      { header: 'Role', dataKey: 'role' },
      { header: 'Satuan', dataKey: 'satuan' },
      { header: 'Last Login', dataKey: 'lastLoginAt' },
    ]);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold">Manajemen User</h1>
          <p className="text-muted-foreground">
            Kelola akses pengguna sistem
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleExportCSV}>
              <Download className="mr-2 h-4 w-4" />
              CSV
            </Button>
            <Button variant="outline" size="sm" onClick={handleExportExcel}>
              <Download className="mr-2 h-4 w-4" />
              Excel
            </Button>
            <Button variant="outline" size="sm" onClick={handleExportPDF}>
              <Download className="mr-2 h-4 w-4" />
              PDF
            </Button>
          </div>
          <Button onClick={handleAdd}>
            <Plus className="mr-2 h-4 w-4" />
            Tambah User
          </Button>
        </div>
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
                          <Button variant="ghost" size="sm" onClick={() => handleEdit(user)}>
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

      <UserFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setEditingUser(null);
        }}
        onSubmit={handleFormSubmit}
        user={editingUser}
      />
    </div>
  );
}

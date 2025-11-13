import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StorageService } from '@/services/storage';
import { Personel, Fasilitas } from '@/types/models';
import { Users, Stethoscope, Heart, Activity } from 'lucide-react';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export function Dashboard() {
  const personel = StorageService.get<Personel[]>('personel') || [];
  const fasilitas = StorageService.get<Fasilitas[]>('fasilitas') || [];

  const stats = useMemo(() => {
    const dokter = personel.filter(p => p.pekerjaan === 'Dokter').length;
    const dokterGigi = personel.filter(p => p.pekerjaan === 'Dokter Gigi').length;
    const perawat = personel.filter(p => p.pekerjaan === 'Perawat').length;
    const spesialis = personel.filter(p => p.pekerjaan === 'Spesialis').length;

    return {
      total: personel.length,
      dokter,
      dokterGigi,
      perawat,
      spesialis,
    };
  }, [personel]);

  const pangkatData = useMemo(() => {
    const counts = personel.reduce((acc, p) => {
      acc[p.pangkat] = (acc[p.pangkat] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [personel]);

  const satuanData = useMemo(() => {
    const counts = personel.reduce((acc, p) => {
      acc[p.satuan] = (acc[p.satuan] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const sorted = Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    return sorted.map(([name, value]) => ({ name, value }));
  }, [personel]);

  const keluhanData = useMemo(() => {
    const monthlyData: Record<string, number> = {};

    personel.forEach(p => {
      p.keluhanBulanan?.forEach(k => {
        monthlyData[k.month] = (monthlyData[k.month] || 0) + k.count;
      });
    });

    return Object.entries(monthlyData)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([month, count]) => ({ month, count }));
  }, [personel]);

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">Dashboard</h1>
        <p className="text-sm sm:text-base text-muted-foreground mt-1">
          Ringkasan data tenaga kesehatan TNI Angkatan Udara
        </p>
      </div>

      <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Total Personel</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground hidden sm:block">
              Tenaga kesehatan aktif
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Dokter</CardTitle>
            <Stethoscope className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{stats.dokter}</div>
            <p className="text-xs text-muted-foreground hidden sm:block">
              Dokter umum + {stats.dokterGigi} dokter gigi
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Perawat</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{stats.perawat}</div>
            <p className="text-xs text-muted-foreground hidden sm:block">
              Perawat kesehatan
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Spesialis</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{stats.spesialis}</div>
            <p className="text-xs text-muted-foreground hidden sm:block">
              Dokter spesialis
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-3 sm:gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">Distribusi Per Pangkat</CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={pangkatData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} angle={-45} textAnchor="end" height={60} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={{ fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="value" fill="#3b82f6" name="Jumlah" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">Distribusi Per Satuan (Top 5)</CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={satuanData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => {
                    // Truncate long names on mobile
                    const shortName = name.length > 15 ? `${name.substring(0, 12)}...` : name;
                    return `${shortName}: ${(percent * 100).toFixed(0)}%`;
                  }}
                  outerRadius={60}
                  fill="#8884d8"
                  dataKey="value"
                  style={{ fontSize: 10 }}
                >
                  {satuanData.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base sm:text-lg">Tren Keluhan Kesehatan Bulanan</CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={keluhanData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip contentStyle={{ fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#10b981"
                strokeWidth={2}
                name="Jumlah Keluhan"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Peta Sebaran Fasilitas Kesehatan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg bg-slate-100 p-8 text-center text-muted-foreground">
            <p className="mb-2">Peta interaktif tersedia di halaman Peta Sebaran</p>
            <p className="text-sm">Total {fasilitas.length} fasilitas kesehatan TNI AU</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Repository } from '@/services/repository';
import { Pelatihan, Personel, StatusSertifikat } from '@/types/models';
import { format, differenceInDays } from 'date-fns';

const pelatihanRepo = new Repository<Pelatihan>('pelatihan', 'Pelatihan');
const personelRepo = new Repository<Personel>('personel', 'Personel');

export function PelatihanPage() {
  const [pelatihan] = useState<Pelatihan[]>(pelatihanRepo.getAll());
  const [personel] = useState<Personel[]>(personelRepo.getAll());

  const pelatihanWithPersonel = useMemo(() => {
    return pelatihan.map(p => {
      const person = personel.find(per => per.id === p.personelId);
      const daysUntilExpiry = differenceInDays(new Date(p.sertifikatBerlakuHingga), new Date());
      
      let status: StatusSertifikat = 'Berlaku';
      if (daysUntilExpiry < 0) {
        status = 'Kedaluwarsa';
      } else if (daysUntilExpiry <= 30) {
        status = 'Akan Berakhir';
      }

      return {
        ...p,
        personelNama: person?.nama || 'Unknown',
        status,
        daysUntilExpiry,
      };
    });
  }, [pelatihan, personel]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Pendidikan & Pelatihan</h1>
        <p className="text-muted-foreground">
          Kelola data pelatihan tenaga kesehatan
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Data Pelatihan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium">Personel</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Jenis Pelatihan</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Tanggal Mulai</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Tanggal Selesai</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Berlaku Hingga</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {pelatihanWithPersonel.map((p) => (
                    <tr key={p.id} className="hover:bg-muted/50">
                      <td className="px-4 py-3 text-sm font-medium">{p.personelNama}</td>
                      <td className="px-4 py-3 text-sm">{p.jenis}</td>
                      <td className="px-4 py-3 text-sm">
                        {format(new Date(p.tanggalMulai), 'dd MMM yyyy')}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {format(new Date(p.tanggalSelesai), 'dd MMM yyyy')}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {format(new Date(p.sertifikatBerlakuHingga), 'dd MMM yyyy')}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={
                              p.status === 'Berlaku' ? 'success' :
                              p.status === 'Akan Berakhir' ? 'warning' :
                              'destructive'
                            }
                          >
                            {p.status}
                          </Badge>
                          {p.status === 'Akan Berakhir' && (
                            <span className="text-xs text-muted-foreground">
                              ({p.daysUntilExpiry} hari lagi)
                            </span>
                          )}
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

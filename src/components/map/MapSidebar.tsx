import { useState } from 'react';
import { Search, X, Filter, MapPin, List } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Fasilitas, JenisFasilitas } from '@/types/models';
import { MapFilters, MapUIPreferences } from '@/store/mapStore';

interface MapSidebarProps {
  filters: MapFilters;
  uiPreferences: MapUIPreferences;
  allSpesialisasi: string[];
  filteredFasilitas: Fasilitas[];
  onFiltersChange: (filters: Partial<MapFilters>) => void;
  onResetFilters: () => void;
  onUIPreferencesChange: (prefs: Partial<MapUIPreferences>) => void;
  onFacilityFocus: (id: string) => void;
}

const JENIS_OPTIONS: JenisFasilitas[] = ['Lanud', 'RSAU', 'Koopsau', 'Kodau', 'Satrad'];
const KOMANDO_OPTIONS = [
  'KOOPSAU I',
  'KOOPSAU II', 
  'KOOPSAU III',
  'KODAU I',
  'KODAU II',
  'KODAU III',
  'Lanud',
  'RSAU',
  'Satrad',
];

export function MapSidebar({
  filters,
  uiPreferences,
  allSpesialisasi,
  filteredFasilitas,
  onFiltersChange,
  onResetFilters,
  onUIPreferencesChange,
  onFacilityFocus,
}: MapSidebarProps) {
  const [showFilters, setShowFilters] = useState(true);
  const [spesialisasiInput, setSpesialisasiInput] = useState('');

  const toggleJenisFasilitas = (jenis: JenisFasilitas) => {
    const current = filters.jenisFasilitas;
    const updated = current.includes(jenis)
      ? current.filter((j) => j !== jenis)
      : [...current, jenis];
    onFiltersChange({ jenisFasilitas: updated });
  };

  const toggleKomando = (komando: string) => {
    const current = filters.komando;
    const updated = current.includes(komando)
      ? current.filter((k) => k !== komando)
      : [...current, komando];
    onFiltersChange({ komando: updated });
  };

  const addSpesialisasi = () => {
    if (spesialisasiInput.trim() && !filters.spesialisasi.includes(spesialisasiInput.trim())) {
      onFiltersChange({
        spesialisasi: [...filters.spesialisasi, spesialisasiInput.trim()],
      });
      setSpesialisasiInput('');
    }
  };

  const removeSpesialisasi = (spesialisasi: string) => {
    onFiltersChange({
      spesialisasi: filters.spesialisasi.filter((s) => s !== spesialisasi),
    });
  };

  const hasActiveFilters = 
    filters.jenisFasilitas.length > 0 ||
    filters.komando.length > 0 ||
    filters.spesialisasi.length > 0 ||
    filters.search.trim() !== '';

  return (
    <div className="h-full flex flex-col bg-white border-r">
      {/* Header */}
      <div className="p-4 border-b">
        <h2 className="text-xl font-bold mb-4">Peta Sebaran</h2>
        
        {/* Global Search */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="text"
            placeholder="Cari fasilitas, komando, atau dokter..."
            value={filters.search}
            onChange={(e) => onFiltersChange({ search: e.target.value })}
            className="pl-10 pr-10"
          />
          {filters.search && (
            <button
              onClick={() => onFiltersChange({ search: '' })}
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
            >
              <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
            </button>
          )}
        </div>

        {/* View Mode Toggle */}
        <div className="flex gap-2">
          <Button
            size="sm"
            variant={uiPreferences.viewMode === 'map' ? 'default' : 'outline'}
            onClick={() => onUIPreferencesChange({ viewMode: 'map' })}
            className="flex-1"
          >
            <MapPin className="h-4 w-4 mr-1" />
            Peta
          </Button>
          <Button
            size="sm"
            variant={uiPreferences.viewMode === 'list' ? 'default' : 'outline'}
            onClick={() => onUIPreferencesChange({ viewMode: 'list' })}
            className="flex-1"
          >
            <List className="h-4 w-4 mr-1" />
            List
          </Button>
          <Button
            size="sm"
            variant={uiPreferences.viewMode === 'both' ? 'default' : 'outline'}
            onClick={() => onUIPreferencesChange({ viewMode: 'both' })}
            className="flex-1"
          >
            Kedua
          </Button>
        </div>
      </div>

      {/* Filters Toggle */}
      <div className="px-4 py-2 border-b flex items-center justify-between">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 text-sm font-semibold hover:text-primary"
        >
          <Filter className="h-4 w-4" />
          Filter
          {hasActiveFilters && (
            <Badge variant="default" className="ml-1">
              Aktif
            </Badge>
          )}
        </button>
        {hasActiveFilters && (
          <Button size="sm" variant="ghost" onClick={onResetFilters}>
            Reset
          </Button>
        )}
      </div>

      {/* Filters Section */}
      {showFilters && (
        <div className="px-4 py-3 border-b space-y-4 overflow-y-auto flex-shrink-0">
          {/* Jenis Fasilitas */}
          <div>
            <label className="text-sm font-semibold mb-2 block">Jenis Fasilitas</label>
            <div className="space-y-2">
              {JENIS_OPTIONS.map((jenis) => (
                <label key={jenis} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.jenisFasilitas.includes(jenis)}
                    onChange={() => toggleJenisFasilitas(jenis)}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm">{jenis}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Komando */}
          <div>
            <label className="text-sm font-semibold mb-2 block">Komando</label>
            <div className="space-y-2 max-h-[200px] overflow-y-auto">
              {KOMANDO_OPTIONS.map((komando) => (
                <label key={komando} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.komando.includes(komando)}
                    onChange={() => toggleKomando(komando)}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm">{komando}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Spesialisasi */}
          <div>
            <label className="text-sm font-semibold mb-2 block">Spesialisasi Dokter</label>
            <div className="flex gap-2 mb-2">
              <Input
                type="text"
                placeholder="Tambah spesialisasi..."
                value={spesialisasiInput}
                onChange={(e) => setSpesialisasiInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addSpesialisasi();
                  }
                }}
                className="flex-1 text-sm"
                list="spesialisasi-options"
              />
              <datalist id="spesialisasi-options">
                {allSpesialisasi.map((s) => (
                  <option key={s} value={s} />
                ))}
              </datalist>
              <Button size="sm" onClick={addSpesialisasi}>
                +
              </Button>
            </div>
            <div className="flex flex-wrap gap-1">
              {filters.spesialisasi.map((s) => (
                <Badge key={s} variant="secondary" className="text-xs">
                  {s}
                  <button
                    onClick={() => removeSpesialisasi(s)}
                    className="ml-1 hover:text-destructive"
                  >
                    ×
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Results List */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold">
              Hasil: {filteredFasilitas.length} fasilitas
            </span>
          </div>

          <div className="space-y-2">
            {filteredFasilitas.map((f) => (
              <div
                key={f.id}
                className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => onFacilityFocus(f.id)}
              >
                <div className="font-semibold text-sm mb-1">{f.nama}</div>
                <div className="flex gap-1 mb-2 flex-wrap">
                  <Badge variant="default" className="text-xs">{f.jenis}</Badge>
                  <Badge variant="secondary" className="text-xs">{f.komando}</Badge>
                </div>
                <div className="text-xs text-muted-foreground">
                  {f.dokterList?.length || 0} dokter • {f.ringkasan.perawat} perawat
                </div>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="w-full mt-2 text-xs"
                  onClick={(e) => {
                    e.stopPropagation();
                    onFacilityFocus(f.id);
                  }}
                >
                  <MapPin className="h-3 w-3 mr-1" />
                  Focus
                </Button>
              </div>
            ))}
          </div>

          {filteredFasilitas.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <p className="text-sm">Tidak ada fasilitas yang sesuai</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

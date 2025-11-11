import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Fasilitas, JenisFasilitas } from '@/types/models';
import { StorageService } from '@/services/storage';

export interface MapFilters {
  search: string;
  jenisFasilitas: JenisFasilitas[];
  komando: string[];
  spesialisasi: string[];
}

export interface MapUIPreferences {
  viewMode: 'map' | 'list' | 'both';
  sidebarOpen: boolean;
}

interface MapState {
  fasilitas: Fasilitas[];
  filters: MapFilters;
  uiPreferences: MapUIPreferences;
  highlightedFacilityIds: string[];
  selectedFacilityId: string | null;
  
  // Actions
  setFasilitas: (fasilitas: Fasilitas[]) => void;
  setFilters: (filters: Partial<MapFilters>) => void;
  resetFilters: () => void;
  setUIPreferences: (prefs: Partial<MapUIPreferences>) => void;
  setHighlightedFacilities: (ids: string[]) => void;
  setSelectedFacility: (id: string | null) => void;
  
  // Computed
  getFilteredFasilitas: () => Fasilitas[];
  getAllSpesialisasi: () => string[];
  saveFasilitasToStorage: () => void;
}

const defaultFilters: MapFilters = {
  search: '',
  jenisFasilitas: [],
  komando: [],
  spesialisasi: [],
};

const defaultUIPreferences: MapUIPreferences = {
  viewMode: 'both',
  sidebarOpen: true,
};

export const useMapStore = create<MapState>()(
  persist(
    (set, get) => ({
      fasilitas: [],
      filters: defaultFilters,
      uiPreferences: defaultUIPreferences,
      highlightedFacilityIds: [],
      selectedFacilityId: null,

      setFasilitas: (fasilitas) => set({ fasilitas }),

      setFilters: (filters) => 
        set((state) => ({ 
          filters: { ...state.filters, ...filters } 
        })),

      resetFilters: () => set({ filters: defaultFilters, highlightedFacilityIds: [] }),

      setUIPreferences: (prefs) =>
        set((state) => ({ 
          uiPreferences: { ...state.uiPreferences, ...prefs } 
        })),

      setHighlightedFacilities: (ids) => set({ highlightedFacilityIds: ids }),

      setSelectedFacility: (id) => set({ selectedFacilityId: id }),

      getFilteredFasilitas: () => {
        const { fasilitas, filters } = get();
        
        return fasilitas.filter((f) => {
          // Filter by jenis fasilitas
          if (filters.jenisFasilitas.length > 0 && !filters.jenisFasilitas.includes(f.jenis)) {
            return false;
          }

          // Filter by komando
          if (filters.komando.length > 0 && !filters.komando.includes(f.komando)) {
            return false;
          }

          // Filter by spesialisasi
          if (filters.spesialisasi.length > 0) {
            const hasMatchingSpesialisasi = f.dokterList?.some(
              (d) => d.spesialisasi && filters.spesialisasi.includes(d.spesialisasi)
            );
            if (!hasMatchingSpesialisasi) {
              return false;
            }
          }

          // Global search
          if (filters.search.trim()) {
            const searchLower = filters.search.toLowerCase();
            const matchesName = f.nama.toLowerCase().includes(searchLower);
            const matchesKomando = f.komando.toLowerCase().includes(searchLower);
            const matchesDokter = f.dokterList?.some(
              (d) =>
                d.nama.toLowerCase().includes(searchLower) ||
                (d.spesialisasi && d.spesialisasi.toLowerCase().includes(searchLower))
            );

            return matchesName || matchesKomando || matchesDokter;
          }

          return true;
        });
      },

      getAllSpesialisasi: () => {
        const { fasilitas } = get();
        const spesialisasiSet = new Set<string>();
        
        fasilitas.forEach((f) => {
          f.dokterList?.forEach((d) => {
            if (d.spesialisasi) {
              spesialisasiSet.add(d.spesialisasi);
            }
          });
        });

        return Array.from(spesialisasiSet).sort();
      },

      saveFasilitasToStorage: () => {
        const { fasilitas } = get();
        StorageService.set('fasilitas', fasilitas);
      },
    }),
    {
      name: 'binprofkes:map:ui',
      partialize: (state) => ({ 
        uiPreferences: state.uiPreferences,
        filters: state.filters 
      }),
    }
  )
);

import { useEffect, useMemo } from 'react';
import { useMapStore } from '@/store/mapStore';
import { Repository } from '@/services/repository';
import { Fasilitas } from '@/types/models';
import { MapView } from '@/components/map/MapView';
import { MapSidebar } from '@/components/map/MapSidebar';

const fasilitasRepo = new Repository<Fasilitas>('fasilitas', 'Fasilitas');

export function PetaSebaranPage() {
  const {
    fasilitas,
    filters,
    uiPreferences,
    highlightedFacilityIds,
    selectedFacilityId,
    setFasilitas,
    setFilters,
    resetFilters,
    setUIPreferences,
    setHighlightedFacilities,
    setSelectedFacility,
    getFilteredFasilitas,
    getAllSpesialisasi,
  } = useMapStore();

  // Load fasilitas data on mount
  useEffect(() => {
    const data = fasilitasRepo.getAll();
    setFasilitas(data);
  }, [setFasilitas]);

  // Get filtered fasilitas
  const filteredFasilitas = useMemo(() => {
    return getFilteredFasilitas();
  }, [getFilteredFasilitas, fasilitas, filters]);

  // Get all available spesialisasi
  const allSpesialisasi = useMemo(() => {
    return getAllSpesialisasi();
  }, [getAllSpesialisasi, fasilitas]);

  // Update highlighted facilities when filters change
  useEffect(() => {
    const ids = filteredFasilitas.map((f) => f.id);
    setHighlightedFacilities(ids);
  }, [filteredFasilitas, setHighlightedFacilities]);

  const handleFacilityFocus = (id: string) => {
    setSelectedFacility(id);
  };

  const handleFacilitySelect = (id: string) => {
    setSelectedFacility(id);
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex">
      {/* Sidebar */}
      {uiPreferences.sidebarOpen && (
        <div className="w-[380px] flex-shrink-0">
          <MapSidebar
            filters={filters}
            uiPreferences={uiPreferences}
            allSpesialisasi={allSpesialisasi}
            filteredFasilitas={filteredFasilitas}
            onFiltersChange={setFilters}
            onResetFilters={resetFilters}
            onUIPreferencesChange={setUIPreferences}
            onFacilityFocus={handleFacilityFocus}
          />
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Map View */}
        {(uiPreferences.viewMode === 'map' || uiPreferences.viewMode === 'both') && (
          <div className={uiPreferences.viewMode === 'both' ? 'flex-1' : 'h-full'}>
            <MapView
              fasilitas={filteredFasilitas}
              highlightedIds={highlightedFacilityIds}
              selectedFacilityId={selectedFacilityId}
              onFacilitySelect={handleFacilitySelect}
              searchQuery={filters.search}
            />
          </div>
        )}

        {/* List View */}
        {(uiPreferences.viewMode === 'list' || uiPreferences.viewMode === 'both') && (
          <div className={`${
            uiPreferences.viewMode === 'both' ? 'h-[300px]' : 'flex-1'
          } overflow-y-auto border-t`}>
            <div className="p-4">
              <h3 className="text-lg font-bold mb-4">Daftar Fasilitas</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100 border-b">
                      <th className="text-left p-2 text-sm font-semibold">Nama Fasilitas</th>
                      <th className="text-left p-2 text-sm font-semibold">Jenis</th>
                      <th className="text-left p-2 text-sm font-semibold">Komando</th>
                      <th className="text-center p-2 text-sm font-semibold">Dokter</th>
                      <th className="text-center p-2 text-sm font-semibold">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredFasilitas.map((f) => (
                      <tr key={f.id} className="border-b hover:bg-gray-50">
                        <td className="p-2 text-sm">{f.nama}</td>
                        <td className="p-2">
                          <span className="inline-block px-2 py-1 text-xs rounded bg-blue-100 text-blue-800">
                            {f.jenis}
                          </span>
                        </td>
                        <td className="p-2">
                          <span className="inline-block px-2 py-1 text-xs rounded bg-gray-100 text-gray-800">
                            {f.komando}
                          </span>
                        </td>
                        <td className="p-2 text-center text-sm">
                          {f.dokterList?.length || 0}
                        </td>
                        <td className="p-2 text-center">
                          <button
                            onClick={() => handleFacilityFocus(f.id)}
                            className="text-xs text-blue-600 hover:text-blue-800 font-semibold"
                          >
                            Focus
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredFasilitas.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <p>Tidak ada fasilitas yang sesuai dengan filter</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Toggle Sidebar Button */}
      <button
        onClick={() => setUIPreferences({ sidebarOpen: !uiPreferences.sidebarOpen })}
        className="fixed left-0 top-1/2 transform -translate-y-1/2 bg-white border border-l-0 rounded-r-md p-2 shadow-md hover:bg-gray-50 z-[1000]"
        style={{ 
          left: uiPreferences.sidebarOpen ? '380px' : '0',
          transition: 'left 0.3s ease'
        }}
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {uiPreferences.sidebarOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          )}
        </svg>
      </button>
    </div>
  );
}

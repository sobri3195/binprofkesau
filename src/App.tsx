import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { Login } from '@/pages/Login';
import { Dashboard } from '@/pages/Dashboard';
import { PersonelPage } from '@/pages/Personel';
import { PendidikanPelatihanPage } from '@/pages/PendidikanPelatihan';
import { PetaPage } from '@/pages/Peta';
import { PetaSebaranPage } from '@/pages/PetaSebaran';
import { NotifikasiPage } from '@/pages/Notifikasi';
import { LogAktivitasPage } from '@/pages/LogAktivitas';
import { UsersPage } from '@/pages/Users';
import { AppLayout } from '@/components/layout/AppLayout';
import { seedData } from '@/data/seed';
import { useEffect } from 'react';

function ProtectedRoute({ children, allowedRoles }: { children: React.ReactNode; allowedRoles?: string[] }) {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/app/dashboard" replace />;
  }

  return <>{children}</>;
}

function App() {
  useEffect(() => {
    seedData();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/app"
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/app/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="personel" element={<PersonelPage />} />
          <Route path="pelatihan" element={<PendidikanPelatihanPage />} />
          <Route path="peta" element={<PetaPage />} />
          <Route path="peta-sebaran" element={<PetaSebaranPage />} />
          <Route path="notifikasi" element={<NotifikasiPage />} />
          <Route path="log" element={<LogAktivitasPage />} />
          <Route path="users" element={<UsersPage />} />
        </Route>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

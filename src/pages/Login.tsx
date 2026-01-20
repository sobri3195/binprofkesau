import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const success = await login(email, password);

    if (success) {
      navigate('/app/dashboard');
    } else {
      setError('Email atau password salah');
    }

    setLoading(false);
  };

  /**
   * Quick Login Bypass Handler
   * Allows one-click login for development and testing
   * 
   * @param demoEmail - Predefined demo account email
   * @param demoPassword - Predefined demo account password
   * 
   * Features:
   * - Instant login without typing credentials
   * - Saves to localStorage (key: binprofkes:currentUser)
   * - Auto-redirect to dashboard on success
   * - Logs activity via AuditService
   */
  const handleQuickLogin = async (demoEmail: string, demoPassword: string) => {
    setError('');
    setLoading(true);

    const success = await login(demoEmail, demoPassword);

    if (success) {
      navigate('/app/dashboard');
    } else {
      setError('Login gagal');
    }

    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 pb-4">
          <CardTitle className="text-xl sm:text-2xl font-bold text-center">BINPROFKES</CardTitle>
          <CardDescription className="text-center text-xs sm:text-sm">
            Sistem Informasi Bina Profesional Kesehatan TNI AU
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="email@binprofkes.mil.id"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && (
              <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Masuk...' : 'Masuk'}
            </Button>

            <div className="mt-3 sm:mt-4 text-xs text-muted-foreground">
              <p className="font-medium mb-2 sm:mb-3 text-xs sm:text-sm">🔐 Quick Login - Klik untuk masuk:</p>
              <div className="space-y-1.5 sm:space-y-2">
                <button
                  type="button"
                  onClick={() => handleQuickLogin('superadmin@binprofkes.mil.id', 'admin123')}
                  disabled={loading}
                  className="w-full flex items-center justify-between p-2 sm:p-3 rounded-lg border border-slate-200 hover:border-primary hover:bg-primary/5 transition-colors text-left group disabled:opacity-50"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-slate-700 group-hover:text-primary text-xs sm:text-sm truncate">👑 Super Admin</p>
                    <p className="text-xs text-slate-500 hidden sm:block">Full access - All permissions</p>
                  </div>
                  <span className="text-primary opacity-0 group-hover:opacity-100 transition-opacity ml-2">→</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickLogin('admin.halim@binprofkes.mil.id', 'admin123')}
                  disabled={loading}
                  className="w-full flex items-center justify-between p-2 sm:p-3 rounded-lg border border-slate-200 hover:border-blue-500 hover:bg-blue-50 transition-colors text-left group disabled:opacity-50"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-slate-700 group-hover:text-blue-600 text-xs sm:text-sm truncate">🏢 Admin Satuan</p>
                    <p className="text-xs text-slate-500 hidden sm:block">Lanud Halim Perdanakusuma</p>
                  </div>
                  <span className="text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity ml-2">→</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickLogin('operator@binprofkes.mil.id', 'operator123')}
                  disabled={loading}
                  className="w-full flex items-center justify-between p-2 sm:p-3 rounded-lg border border-slate-200 hover:border-green-500 hover:bg-green-50 transition-colors text-left group disabled:opacity-50"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-slate-700 group-hover:text-green-600 text-xs sm:text-sm truncate">⚙️ Operator</p>
                    <p className="text-xs text-slate-500 hidden sm:block">Operator Kesehatan</p>
                  </div>
                  <span className="text-green-500 opacity-0 group-hover:opacity-100 transition-opacity ml-2">→</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickLogin('viewer@binprofkes.mil.id', 'viewer123')}
                  disabled={loading}
                  className="w-full flex items-center justify-between p-2 sm:p-3 rounded-lg border border-slate-200 hover:border-purple-500 hover:bg-purple-50 transition-colors text-left group disabled:opacity-50"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-slate-700 group-hover:text-purple-600 text-xs sm:text-sm truncate">👁️ Viewer</p>
                    <p className="text-xs text-slate-500 hidden sm:block">View-only dashboard</p>
                  </div>
                  <span className="text-purple-500 opacity-0 group-hover:opacity-100 transition-opacity ml-2">→</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickLogin('bypass@binprofkes.mil.id', 'bypass123')}
                  disabled={loading}
                  className="w-full flex items-center justify-between p-2 sm:p-3 rounded-lg border-2 border-orange-300 hover:border-orange-500 bg-orange-50 hover:bg-orange-100 transition-colors text-left group disabled:opacity-50"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-orange-700 group-hover:text-orange-800 text-xs sm:text-sm truncate">⚡ Bypass Account</p>
                    <p className="text-xs text-orange-600 hidden sm:block">Quick testing access</p>
                  </div>
                  <span className="text-orange-600 opacity-0 group-hover:opacity-100 transition-opacity ml-2">→</span>
                </button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

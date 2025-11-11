import { useState } from 'react';
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

  const handleSubmit = async (e: React.FormEvent) => {
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
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">BINPROFKES</CardTitle>
          <CardDescription className="text-center">
            Sistem Informasi Bina Profesional Kesehatan TNI AU
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
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

            <div className="mt-4 text-xs text-muted-foreground">
              <p className="font-medium mb-3 text-sm">🔐 Quick Login - Klik untuk masuk:</p>
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => handleQuickLogin('superadmin@binprofkes.mil.id', 'admin123')}
                  disabled={loading}
                  className="w-full flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:border-primary hover:bg-primary/5 transition-colors text-left group disabled:opacity-50"
                >
                  <div>
                    <p className="font-semibold text-slate-700 group-hover:text-primary">👑 Super Admin</p>
                    <p className="text-xs text-slate-500">Full access - All permissions</p>
                  </div>
                  <span className="text-primary opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickLogin('admin.halim@binprofkes.mil.id', 'admin123')}
                  disabled={loading}
                  className="w-full flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:border-blue-500 hover:bg-blue-50 transition-colors text-left group disabled:opacity-50"
                >
                  <div>
                    <p className="font-semibold text-slate-700 group-hover:text-blue-600">🏢 Admin Satuan</p>
                    <p className="text-xs text-slate-500">Lanud Halim Perdanakusuma</p>
                  </div>
                  <span className="text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickLogin('operator@binprofkes.mil.id', 'operator123')}
                  disabled={loading}
                  className="w-full flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:border-green-500 hover:bg-green-50 transition-colors text-left group disabled:opacity-50"
                >
                  <div>
                    <p className="font-semibold text-slate-700 group-hover:text-green-600">⚙️ Operator</p>
                    <p className="text-xs text-slate-500">Operator Kesehatan</p>
                  </div>
                  <span className="text-green-500 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickLogin('viewer@binprofkes.mil.id', 'viewer123')}
                  disabled={loading}
                  className="w-full flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:border-purple-500 hover:bg-purple-50 transition-colors text-left group disabled:opacity-50"
                >
                  <div>
                    <p className="font-semibold text-slate-700 group-hover:text-purple-600">👁️ Viewer</p>
                    <p className="text-xs text-slate-500">View-only dashboard</p>
                  </div>
                  <span className="text-purple-500 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickLogin('bypass@binprofkes.mil.id', 'bypass123')}
                  disabled={loading}
                  className="w-full flex items-center justify-between p-3 rounded-lg border-2 border-orange-300 hover:border-orange-500 bg-orange-50 hover:bg-orange-100 transition-colors text-left group disabled:opacity-50"
                >
                  <div>
                    <p className="font-bold text-orange-700 group-hover:text-orange-800">⚡ Bypass Account</p>
                    <p className="text-xs text-orange-600">Quick testing access</p>
                  </div>
                  <span className="text-orange-600 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                </button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

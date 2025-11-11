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
              <p className="font-medium mb-2">Demo Akun:</p>
              <ul className="space-y-1">
                <li>SuperAdmin: superadmin@binprofkes.mil.id / admin123</li>
                <li>AdminSatuan: admin.halim@binprofkes.mil.id / admin123</li>
                <li>Operator: operator@binprofkes.mil.id / operator123</li>
                <li>Viewer: viewer@binprofkes.mil.id / viewer123</li>
                <li className="text-primary font-semibold">Bypass: bypass@binprofkes.mil.id / bypass123</li>
              </ul>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

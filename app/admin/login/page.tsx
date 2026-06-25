// app/admin/login/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Shield, Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function AdminLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      // Transition to admin dashboard on success
      router.push('/admin');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-black via-gray-900 to-yellow-900/20 px-4">
      {/* Return home link */}
      <Link href="/" className="absolute top-8 left-8 text-sm font-medium text-gray-400 hover:text-yellow-400 flex items-center gap-2 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Return to Storefront
      </Link>

      <Card className="w-full max-w-md bg-gray-950 border-gray-800 text-white shadow-2xl relative overflow-hidden">
        {/* Visual design honeycomb highlight */}
        <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-yellow-500 to-yellow-400"></div>

        <CardHeader className="space-y-2 text-center pt-8">
          <div className="mx-auto bg-yellow-500/10 p-3 rounded-full w-12 h-12 flex items-center justify-center border border-yellow-500/20">
            <Shield className="w-6 h-6 text-yellow-500" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight text-white mt-4">
            Administrator Access
          </CardTitle>
          <CardDescription className="text-gray-400">
            Secure login to manage products, categories, and banners
          </CardDescription>
        </CardHeader>

        <CardContent className="pb-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="username" className="text-sm font-semibold text-gray-300">
                Admin Username
              </label>
              <input
                id="username"
                type="text"
                required
                disabled={isLoading}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded-md border border-gray-800 bg-black px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-yellow-500 focus:outline-none focus:ring-1 focus:ring-yellow-500 disabled:opacity-50"
                placeholder="Enter username"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-semibold text-gray-300">
                Admin Password
              </label>
              <input
                id="password"
                type="password"
                required
                disabled={isLoading}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-md border border-gray-800 bg-black px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-yellow-500 focus:outline-none focus:ring-1 focus:ring-yellow-500 disabled:opacity-50"
                placeholder="Enter password"
              />
            </div>

            {error && (
              <div className="p-3 rounded-md bg-red-950/30 border border-red-500/20 text-sm text-red-400 text-center">
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-yellow-500 hover:bg-yellow-400 text-black py-6 text-sm font-bold flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Authenticating...
                </>
              ) : (
                'Login to Dashboard'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
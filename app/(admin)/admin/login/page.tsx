'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';
import { LogIn, Eye, EyeOff } from 'lucide-react';
import { SessionProvider } from 'next-auth/react';
import { ADMIN_TEXT } from '@/lib/adminText';

function LoginForm() {
  const router = useRouter();
  const { status } = useSession();
  const [checkingSetup, setCheckingSetup] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === 'authenticated') router.replace('/admin/dashboard');
  }, [status, router]);

  useEffect(() => {
    async function checkSetup() {
      try {
        const res = await fetch('/api/check-setup');
        const data = await res.json();
        if (!data.setupComplete) { router.replace('/admin/setup'); return; }
      } catch {} finally { setCheckingSetup(false); }
    }
    if (status !== 'authenticated') checkSetup();
  }, [router, status]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const result = await signIn('credentials', { email, password, redirect: false });
    if (result?.error) { setError(ADMIN_TEXT.login.invalidCredentials); setLoading(false); }
    else router.replace('/admin/dashboard');
  };

  if (checkingSetup || status === 'loading' || status === 'authenticated') {
    return (
      <div className="min-h-screen bg-admin-bg flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-admin-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-admin-bg flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="bg-admin-card border border-admin-border rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-xl bg-white/[0.06] flex items-center justify-center mx-auto mb-4">
              <LogIn size={24} className="text-white" strokeWidth={1.5} />
            </div>
            <h1 className="text-white text-xl font-semibold">{ADMIN_TEXT.login.title}</h1>
            <p className="text-gray-500 text-sm mt-1">{ADMIN_TEXT.login.subtitle}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-gray-400 text-xs font-medium mb-1.5 block">{ADMIN_TEXT.login.emailLabel}</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-admin-bg border border-admin-border rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-gray-600 transition-colors"
                placeholder={ADMIN_TEXT.login.emailPlaceholder} required />
            </div>
            <div>
              <label className="text-gray-400 text-xs font-medium mb-1.5 block">{ADMIN_TEXT.login.passwordLabel}</label>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-admin-bg border border-admin-border rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-gray-600 transition-colors pr-10"
                  placeholder={ADMIN_TEXT.login.passwordPlaceholder} required />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2.5 text-red-400 text-sm">{error}</div>
            )}

            <button type="submit" disabled={loading}
              className="w-full bg-white text-black rounded-lg py-2.5 text-sm font-medium hover:bg-gray-200 disabled:opacity-50 transition-colors">
              {loading ? ADMIN_TEXT.login.submitting : ADMIN_TEXT.login.submitButton}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <SessionProvider>
      <LoginForm />
    </SessionProvider>
  );
}

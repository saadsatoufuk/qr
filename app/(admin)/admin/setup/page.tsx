'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Store, KeyRound, Palette, ChevronRight, ChevronLeft, Check } from 'lucide-react';
import { ADMIN_TEXT } from '@/lib/adminText';

const currencyOptions = [
  { code: 'SAR', symbol: 'ر.س', label: 'ريال سعودي (ر.س)' },
  { code: 'USD', symbol: '$', label: 'دولار أمريكي ($)' },
  { code: 'AED', symbol: 'د.إ', label: 'درهم إماراتي (د.إ)' },
  { code: 'KWD', symbol: 'د.ك', label: 'دينار كويتي (د.ك)' },
  { code: 'EGP', symbol: 'ج.م', label: 'جنيه مصري (ج.م)' },
  { code: 'EUR', symbol: '€', label: 'يورو (€)' },
  { code: 'GBP', symbol: '£', label: 'جنيه إسترليني (£)' },
];

export default function SetupPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [currency, setCurrency] = useState('SAR');
  const [currencySymbol, setCurrencySymbol] = useState('ر.س');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [primaryColor, setPrimaryColor] = useState('#D4A853');
  const [logo, setLogo] = useState('');
  const [coverImage, setCoverImage] = useState('');

  useEffect(() => {
    async function checkSetup() {
      try {
        const res = await fetch('/api/check-setup');
        const data = await res.json();
        if (data.setupComplete) { router.replace('/admin/login'); return; }
      } catch {} finally { setChecking(false); }
    }
    checkSetup();
  }, [router]);

  const handleNameChange = (val: string) => {
    setName(val);
    setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''));
  };

  const handleCurrencyChange = (code: string) => {
    setCurrency(code);
    const found = currencyOptions.find((c) => c.code === code);
    if (found) setCurrencySymbol(found.symbol);
  };

  const handleSubmit = async () => {
    if (password !== confirmPassword) { setError(ADMIN_TEXT.setup.passwordMismatch); return; }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, slug, description, address, currency, currencySymbol, email, password, primaryColor, logo, coverImage }),
      });
      if (!res.ok) { const data = await res.json(); throw new Error(data.error || 'Setup failed'); }
      const loginResult = await signIn('credentials', { email, password, redirect: false });
      if (loginResult?.ok) router.push('/admin/dashboard');
    } catch (err: any) { setError(err.message); setLoading(false); }
  };

  const steps = [
    { num: 1, label: ADMIN_TEXT.setup.step1Title, icon: Store },
    { num: 2, label: ADMIN_TEXT.setup.step2Title, icon: KeyRound },
    { num: 3, label: ADMIN_TEXT.setup.step3Title, icon: Palette },
  ];

  if (checking) {
    return (
      <div className="min-h-screen bg-admin-bg flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-admin-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-admin-bg flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="flex items-center justify-center gap-2 mb-8">
          {steps.map((s) => (
            <div key={s.num} className="flex items-center gap-2">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-medium ${
                step > s.num ? 'bg-admin-green text-white' : step === s.num ? 'bg-white text-black' : 'bg-admin-card border border-admin-border text-gray-500'
              }`}>
                {step > s.num ? <Check size={16} /> : s.num}
              </div>
              {s.num < 3 && <div className={`w-12 h-px ${step > s.num ? 'bg-admin-green' : 'bg-admin-border'}`} />}
            </div>
          ))}
        </div>

        <div className="bg-admin-card border border-admin-border rounded-2xl p-8 shadow-2xl">
          {step === 1 && (
            <>
              <div className="mb-6">
                <h2 className="text-white text-lg font-semibold">{ADMIN_TEXT.setup.step1Title}</h2>
                <p className="text-gray-500 text-sm mt-1">{ADMIN_TEXT.setup.step1Subtitle}</p>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-gray-400 text-xs font-medium mb-1.5 block">{ADMIN_TEXT.setup.restaurantName} *</label>
                  <input value={name} onChange={(e) => handleNameChange(e.target.value)} dir="auto"
                    className="w-full bg-admin-bg border border-admin-border rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-gray-600"
                    placeholder={ADMIN_TEXT.setup.restaurantNamePh} required />
                </div>
                <div>
                  <label className="text-gray-400 text-xs font-medium mb-1.5 block">{ADMIN_TEXT.setup.slug}</label>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500 text-sm">/menu/</span>
                    <input value={slug} onChange={(e) => setSlug(e.target.value)}
                      className="flex-1 bg-admin-bg border border-admin-border rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-gray-600"
                      placeholder={ADMIN_TEXT.setup.slugPh} />
                  </div>
                </div>
                <div>
                  <label className="text-gray-400 text-xs font-medium mb-1.5 block">{ADMIN_TEXT.setup.description}</label>
                  <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} dir="auto"
                    className="w-full bg-admin-bg border border-admin-border rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-gray-600 resize-none"
                    placeholder={ADMIN_TEXT.setup.descriptionPh} />
                </div>
                <div>
                  <label className="text-gray-400 text-xs font-medium mb-1.5 block">{ADMIN_TEXT.setup.address}</label>
                  <input value={address} onChange={(e) => setAddress(e.target.value)} dir="auto"
                    className="w-full bg-admin-bg border border-admin-border rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-gray-600"
                    placeholder={ADMIN_TEXT.setup.addressPh} />
                </div>
                <div>
                  <label className="text-gray-400 text-xs font-medium mb-1.5 block">{ADMIN_TEXT.setup.currency}</label>
                  <select value={currency} onChange={(e) => handleCurrencyChange(e.target.value)}
                    className="w-full bg-admin-bg border border-admin-border rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-gray-600">
                    {currencyOptions.map((c) => <option key={c.code} value={c.code}>{c.label}</option>)}
                  </select>
                </div>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div className="mb-6">
                <h2 className="text-white text-lg font-semibold">{ADMIN_TEXT.setup.step2Title}</h2>
                <p className="text-gray-500 text-sm mt-1">{ADMIN_TEXT.setup.step2Subtitle}</p>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-gray-400 text-xs font-medium mb-1.5 block">{ADMIN_TEXT.setup.adminEmail} *</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-admin-bg border border-admin-border rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-gray-600"
                    placeholder={ADMIN_TEXT.setup.adminEmailPh} required />
                </div>
                <div>
                  <label className="text-gray-400 text-xs font-medium mb-1.5 block">{ADMIN_TEXT.setup.adminPassword} *</label>
                  <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-admin-bg border border-admin-border rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-gray-600"
                    placeholder={ADMIN_TEXT.setup.adminPasswordPh} required minLength={6} />
                </div>
                <div>
                  <label className="text-gray-400 text-xs font-medium mb-1.5 block">{ADMIN_TEXT.setup.confirmPassword} *</label>
                  <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-admin-bg border border-admin-border rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-gray-600"
                    placeholder={ADMIN_TEXT.setup.confirmPasswordPh} required minLength={6} />
                </div>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <div className="mb-6">
                <h2 className="text-white text-lg font-semibold">{ADMIN_TEXT.setup.step3Title}</h2>
                <p className="text-gray-500 text-sm mt-1">{ADMIN_TEXT.setup.step3Subtitle}</p>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-gray-400 text-xs font-medium mb-1.5 block">{ADMIN_TEXT.setup.primaryColor}</label>
                  <div className="flex items-center gap-3">
                    <input type="color" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} className="w-10 h-10 rounded-lg cursor-pointer border-0 bg-transparent" />
                    <input value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)}
                      className="flex-1 bg-admin-bg border border-admin-border rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-gray-600" placeholder="#D4A853" />
                    <div className="w-10 h-10 rounded-lg" style={{ backgroundColor: primaryColor }} />
                  </div>
                </div>
                <div>
                  <label className="text-gray-400 text-xs font-medium mb-1.5 block">{ADMIN_TEXT.setup.logoUrl}</label>
                  <input value={logo} onChange={(e) => setLogo(e.target.value)}
                    className="w-full bg-admin-bg border border-admin-border rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-gray-600"
                    placeholder={ADMIN_TEXT.setup.logoUrlPh} />
                  {logo && <img src={logo} alt="Logo" className="w-16 h-16 rounded-full object-cover mt-2 border border-admin-border" />}
                </div>
                <div>
                  <label className="text-gray-400 text-xs font-medium mb-1.5 block">{ADMIN_TEXT.setup.coverImageUrl}</label>
                  <input value={coverImage} onChange={(e) => setCoverImage(e.target.value)}
                    className="w-full bg-admin-bg border border-admin-border rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-gray-600"
                    placeholder={ADMIN_TEXT.setup.coverImageUrlPh} />
                  {coverImage && <img src={coverImage} alt="Cover" className="w-full h-32 rounded-lg object-cover mt-2 border border-admin-border" />}
                </div>
              </div>
            </>
          )}

          {error && <div className="mt-4 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2.5 text-red-400 text-sm">{error}</div>}

          <div className="flex justify-between mt-8">
            {step > 1 ? (
              <button onClick={() => { setStep(step - 1); setError(''); }}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-gray-400 hover:text-white border border-admin-border hover:border-gray-600 transition-colors">
                <ChevronLeft size={16} /> {ADMIN_TEXT.actions.back}
              </button>
            ) : <div />}

            {step < 3 ? (
              <button onClick={() => {
                if (step === 1 && (!name || !slug)) { setError(ADMIN_TEXT.setup.nameRequired); return; }
                if (step === 2 && (!email || !password)) { setError(ADMIN_TEXT.setup.emailRequired); return; }
                setError(''); setStep(step + 1);
              }}
                className="flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-medium bg-white text-black hover:bg-gray-200 transition-colors">
                {ADMIN_TEXT.actions.next} <ChevronRight size={16} />
              </button>
            ) : (
              <button onClick={handleSubmit} disabled={loading}
                className="flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-medium bg-white text-black hover:bg-gray-200 disabled:opacity-50 transition-colors">
                {loading ? ADMIN_TEXT.setup.finishing : ADMIN_TEXT.setup.finishButton}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

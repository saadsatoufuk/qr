'use client';

import { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import { ADMIN_TEXT } from '@/lib/adminText';
import toast from 'react-hot-toast';

const currencies = [
  { code: 'SAR', symbol: 'ر.س', label: 'ريال سعودي (ر.س)' },
  { code: 'USD', symbol: '$', label: 'دولار أمريكي ($)' },
  { code: 'AED', symbol: 'د.إ', label: 'درهم إماراتي (د.إ)' },
  { code: 'KWD', symbol: 'د.ك', label: 'دينار كويتي (د.ك)' },
  { code: 'EGP', symbol: 'ج.م', label: 'جنيه مصري (ج.م)' },
  { code: 'EUR', symbol: '€', label: 'يورو (€)' },
  { code: 'GBP', symbol: '£', label: 'جنيه إسترليني (£)' },
];

export default function SettingsPage() {
  const [form, setForm] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/settings').then(r=>r.json()).then(d=>setForm(d.restaurant)).catch(()=>{});
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      await fetch('/api/settings', {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name, description: form.description, address: form.address,
          primaryColor: form.primaryColor, logo: form.logo, coverImage: form.coverImage,
          isOpen: form.isOpen, currency: form.currency, currencySymbol: form.currencySymbol,
          estimatedWaitMinutes: form.estimatedWaitMinutes,
        }),
      });
      toast.success(ADMIN_TEXT.settings.settingsSaved);
    } catch { toast.error(ADMIN_TEXT.feedback.errorOccurred); }
    setSaving(false);
  };

  if (!form) return <div className="skeleton-admin h-96 rounded-xl" />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-white">{ADMIN_TEXT.settings.title}</h1>
        <button onClick={save} disabled={saving}
          className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-lg text-sm font-medium hover:bg-gray-200 disabled:opacity-50">
          <Save size={16} /> {saving ? ADMIN_TEXT.actions.saving : ADMIN_TEXT.settings.saveSettings}
        </button>
      </div>

      <div className="space-y-6 max-w-2xl">
        {/* General */}
        <div className="bg-admin-card border border-admin-border rounded-xl p-6">
          <h2 className="text-white font-medium mb-4">{ADMIN_TEXT.settings.sectionGeneral}</h2>
          <div className="space-y-4">
            <div>
              <label className="text-gray-400 text-xs font-medium mb-1.5 block">{ADMIN_TEXT.settings.restaurantName}</label>
              <input value={form.name} onChange={e=>setForm({...form, name: e.target.value})} dir="auto"
                className="w-full bg-admin-bg border border-admin-border rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-gray-600" />
            </div>
            <div>
              <label className="text-gray-400 text-xs font-medium mb-1.5 block">{ADMIN_TEXT.settings.slugLabel}</label>
              <input value={form.slug} readOnly className="w-full bg-admin-bg border border-admin-border rounded-lg px-4 py-2.5 text-gray-500 text-sm cursor-not-allowed" />
            </div>
            <div>
              <label className="text-gray-400 text-xs font-medium mb-1.5 block">{ADMIN_TEXT.settings.description}</label>
              <textarea value={form.description||''} onChange={e=>setForm({...form, description: e.target.value})} rows={3} dir="auto"
                className="w-full bg-admin-bg border border-admin-border rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none resize-none" />
            </div>
            <div>
              <label className="text-gray-400 text-xs font-medium mb-1.5 block">{ADMIN_TEXT.settings.address}</label>
              <input value={form.address||''} onChange={e=>setForm({...form, address: e.target.value})} dir="auto"
                className="w-full bg-admin-bg border border-admin-border rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-gray-600" />
            </div>
          </div>
        </div>

        {/* Branding */}
        <div className="bg-admin-card border border-admin-border rounded-xl p-6">
          <h2 className="text-white font-medium mb-4">{ADMIN_TEXT.settings.sectionBranding}</h2>
          <div className="space-y-4">
            <div>
              <label className="text-gray-400 text-xs font-medium mb-1.5 block">{ADMIN_TEXT.settings.primaryColor}</label>
              <div className="flex items-center gap-3">
                <input type="color" value={form.primaryColor} onChange={e=>setForm({...form, primaryColor: e.target.value})} className="w-10 h-10 rounded cursor-pointer border-0 bg-transparent" />
                <input value={form.primaryColor} onChange={e=>setForm({...form, primaryColor: e.target.value})} className="flex-1 bg-admin-bg border border-admin-border rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none" />
                <div className="w-10 h-10 rounded-lg border border-admin-border" style={{backgroundColor: form.primaryColor}} />
              </div>
            </div>
            <div>
              <label className="text-gray-400 text-xs font-medium mb-1.5 block">{ADMIN_TEXT.settings.logoUrl}</label>
              <input value={form.logo||''} onChange={e=>setForm({...form, logo: e.target.value})} className="w-full bg-admin-bg border border-admin-border rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none" />
              {form.logo && <img src={form.logo} alt="Logo" className="w-16 h-16 rounded-full object-cover mt-2 border border-admin-border" />}
            </div>
            <div>
              <label className="text-gray-400 text-xs font-medium mb-1.5 block">{ADMIN_TEXT.settings.coverImageUrl}</label>
              <input value={form.coverImage||''} onChange={e=>setForm({...form, coverImage: e.target.value})} className="w-full bg-admin-bg border border-admin-border rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none" />
              {form.coverImage && <img src={form.coverImage} alt="Cover" className="w-full h-32 rounded-lg object-cover mt-2 border border-admin-border" />}
            </div>
          </div>
        </div>

        {/* Operations */}
        <div className="bg-admin-card border border-admin-border rounded-xl p-6">
          <h2 className="text-white font-medium mb-4">{ADMIN_TEXT.settings.sectionOperations}</h2>
          <div className="space-y-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <div className={`w-10 h-6 rounded-full relative transition-colors ${form.isOpen?'bg-admin-green':'bg-gray-700'}`}
                onClick={()=>setForm({...form,isOpen:!form.isOpen})}>
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${form.isOpen?'left-5':'left-1'}`}/>
              </div>
              <div>
                <span className="text-gray-400 text-sm">{ADMIN_TEXT.settings.isOpen}</span>
                <p className="text-gray-600 text-xs">{ADMIN_TEXT.settings.isOpenHint}</p>
              </div>
            </label>
            <div>
              <label className="text-gray-400 text-xs font-medium mb-1.5 block">{ADMIN_TEXT.settings.currency}</label>
              <select value={form.currency} onChange={e=>{
                const c = currencies.find(x=>x.code===e.target.value);
                setForm({...form, currency: e.target.value, currencySymbol: c?.symbol||'$'});
              }} className="w-full bg-admin-bg border border-admin-border rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none">
                {currencies.map(c=><option key={c.code} value={c.code}>{c.label}</option>)}
              </select>
            </div>
            <div>
              <label className="text-gray-400 text-xs font-medium mb-1.5 block">{ADMIN_TEXT.settings.estimatedWait}</label>
              <input type="number" value={form.estimatedWaitMinutes} onChange={e=>setForm({...form, estimatedWaitMinutes: parseInt(e.target.value)||15})}
                className="w-full bg-admin-bg border border-admin-border rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none" />
              <p className="text-gray-600 text-xs mt-1">{ADMIN_TEXT.settings.estimatedWaitHint}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

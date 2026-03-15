'use client';

import { SessionProvider } from 'next-auth/react';
import Sidebar from '@/components/shared/Sidebar';
import NotificationBell from '@/components/admin/NotificationBell';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <div className="min-h-screen bg-admin-bg text-white font-outfit">
        <Sidebar />
        
        {/* Top bar */}
        <div className="lg:ml-[240px]">
          <header className="sticky top-0 z-30 bg-admin-bg/80 backdrop-blur-md border-b border-admin-border px-6 py-3 flex items-center justify-end">
            <NotificationBell />
          </header>
          
          <main className="p-6">
            {children}
          </main>
        </div>
      </div>
    </SessionProvider>
  );
}

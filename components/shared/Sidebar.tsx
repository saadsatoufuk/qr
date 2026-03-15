'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import {
  LayoutDashboard,
  UtensilsCrossed,
  ShoppingBag,
  QrCode,
  Settings,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { useState } from 'react';
import { ADMIN_TEXT } from '@/lib/adminText';

const navItems = [
  { href: '/admin/dashboard', label: ADMIN_TEXT.nav.dashboard, icon: LayoutDashboard },
  { href: '/admin/menu', label: ADMIN_TEXT.nav.menu, icon: UtensilsCrossed },
  { href: '/admin/orders', label: ADMIN_TEXT.nav.orders, icon: ShoppingBag },
  { href: '/admin/tables', label: ADMIN_TEXT.nav.tables, icon: QrCode },
  { href: '/admin/settings', label: ADMIN_TEXT.nav.settings, icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile hamburger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-admin-card border border-admin-border"
      >
        {isOpen ? <X size={20} color="#fff" /> : <Menu size={20} color="#fff" />}
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full bg-admin-sidebar border-r border-admin-border z-40 flex flex-col transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 lg:w-[240px] w-[240px]`}
      >
        <div className="p-6 border-b border-admin-border">
          <h1 className="text-white font-semibold text-lg">QR Menu</h1>
          <p className="text-gray-500 text-xs mt-1">{ADMIN_TEXT.nav.dashboard}</p>
        </div>

        <nav className="flex-1 py-4 px-3 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-white/[0.06] text-white border-r-2 border-white'
                    : 'text-gray-400 hover:text-white hover:bg-white/[0.03]'
                }`}
              >
                <item.icon size={20} strokeWidth={1.5} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-admin-border">
          <button
            onClick={() => signOut({ callbackUrl: '/admin/login' })}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-400 hover:text-red-400 hover:bg-white/[0.03] w-full transition-colors"
          >
            <LogOut size={20} strokeWidth={1.5} />
            <span>{ADMIN_TEXT.nav.logout}</span>
          </button>
        </div>
      </aside>
    </>
  );
}

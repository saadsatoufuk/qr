'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { ShoppingBag, TrendingUp, BarChart2, Users } from 'lucide-react';
import KanbanColumn from '@/components/admin/KanbanColumn';
import { POLL_INTERVALS } from '@/lib/polling';
import { ADMIN_TEXT } from '@/lib/adminText';
import toast from 'react-hot-toast';

function playChime() {
  try {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.frequency.setValueAtTime(1100, ctx.currentTime + 0.1);
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.5);
  } catch {}
}

const KANBAN_STATUSES = ['pending', 'confirmed', 'preparing', 'ready'] as const;

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>(null);
  const prevOrderIds = useRef<Set<string>>(new Set());
  const isFirstLoad = useRef(true);

  const fetchStats = useCallback(async () => {
    if (document.visibilityState === 'hidden') return;
    try {
      const res = await fetch('/api/dashboard/stats');
      const data = await res.json();
      setStats(data);
    } catch {}
  }, []);

  const fetchOrders = useCallback(async () => {
    if (document.visibilityState === 'hidden') return;
    try {
      const res = await fetch('/api/orders?status=pending,confirmed,preparing,ready&limit=100');
      const data = await res.json();
      const newOrders = data.orders || [];
      setOrders(newOrders);

      const newIds = new Set<string>(newOrders.map((o: any) => o._id));
      if (!isFirstLoad.current) {
        const added = newOrders.filter((o: any) => !prevOrderIds.current.has(o._id));
        if (added.length > 0) {
          playChime();
          added.forEach((o: any) => {
            toast(ADMIN_TEXT.dashboard.newOrderToast(o.tableNumber), { icon: '🔔' });
          });
        }
      }
      isFirstLoad.current = false;
      prevOrderIds.current = newIds as Set<string>;
    } catch {}
  }, []);

  const fetchSettings = useCallback(async () => {
    try {
      const res = await fetch('/api/settings');
      const data = await res.json();
      setSettings(data.restaurant);
    } catch {}
  }, []);

  useEffect(() => {
    fetchStats();
    fetchOrders();
    fetchSettings();
    const statsInt = setInterval(fetchStats, POLL_INTERVALS.dashboardStats);
    const ordersInt = setInterval(fetchOrders, POLL_INTERVALS.orderBoard);
    return () => { clearInterval(statsInt); clearInterval(ordersInt); };
  }, [fetchStats, fetchOrders, fetchSettings]);

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      fetchOrders();
      fetchStats();
    } catch {
      toast.error(ADMIN_TEXT.dashboard.failedUpdate);
    }
  };

  const cs = settings?.currencySymbol || 'ر.س';

  const statsData = [
    { label: ADMIN_TEXT.dashboard.todayOrders, value: stats?.todayOrders ?? '—', icon: ShoppingBag, color: 'text-white', bg: 'bg-white/5', border: 'border-white/10' },
    { label: ADMIN_TEXT.dashboard.todayRevenue, value: stats ? `${stats.totalRevenue} ${cs}` : '—', icon: TrendingUp, color: 'text-[#D4A853]', bg: 'bg-[#D4A853]/5', border: 'border-[#D4A853]/15' },
    { label: ADMIN_TEXT.dashboard.activeTables, value: stats ? `${stats.activeTables}/${stats.totalTables}` : '—', icon: Users, color: 'text-blue-400', bg: 'bg-blue-500/5', border: 'border-blue-500/15' },
    { label: ADMIN_TEXT.dashboard.avgOrderValue, value: stats ? `${stats.avgOrderValue} ${cs}` : '—', icon: BarChart2, color: 'text-purple-400', bg: 'bg-purple-500/5', border: 'border-purple-500/15' },
  ];

  const ordersByStatus: Record<string, any[]> = {};
  KANBAN_STATUSES.forEach(s => { ordersByStatus[s] = []; });
  orders.forEach(o => { if (ordersByStatus[o.status]) ordersByStatus[o.status].push(o); });

  return (
    <div>
      <h1 className="text-2xl font-semibold text-white mb-6">{ADMIN_TEXT.dashboard.title}</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statsData.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className={`${s.bg} border ${s.border} rounded-2xl p-4 flex items-center gap-4`}>
              <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center`}>
                <Icon size={20} className={s.color} />
              </div>
              <div>
                <p className="text-[#888] text-xs">{s.label}</p>
                <p className={`text-lg font-bold ${s.color} mt-0.5`}>{s.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      <h2 className="text-lg font-semibold text-white mb-4">{ADMIN_TEXT.dashboard.liveOrders}</h2>
      <div className="flex gap-4 overflow-x-auto pb-6 no-scrollbar" style={{ scrollSnapType: 'x mandatory' }}>
        {KANBAN_STATUSES.map(status => (
          <KanbanColumn key={status} status={status} orders={ordersByStatus[status]} onStatusChange={updateOrderStatus} currencySymbol={cs} />
        ))}
      </div>
    </div>
  );
}

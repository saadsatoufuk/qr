'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { POLL_INTERVALS } from '@/lib/polling';
import { UI_TEXT } from '@/lib/orderHelpers';
import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';
import { motion } from 'framer-motion';
import { CheckCircle, ClipboardCheck, ChefHat, Bell, XCircle, Clock } from 'lucide-react';

const STEPS = [
  { key: 'pending',   label: UI_TEXT.statusReceived,  icon: ClipboardCheck },
  { key: 'confirmed', label: UI_TEXT.statusConfirmed,  icon: CheckCircle },
  { key: 'preparing', label: UI_TEXT.statusPreparing,  icon: ChefHat },
  { key: 'ready',     label: UI_TEXT.statusReady,      icon: Bell },
];

export default function OrderTrackingPage({ params }: { params: { slug: string; orderId: string } }) {
  const [order, setOrder] = useState<any>(null);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [restaurant, setRestaurant] = useState<any>(null);
  const pollRef = useRef<NodeJS.Timeout>();

  const fetchOrder = useCallback(async () => {
    try {
      const res = await fetch(`/api/orders/${params.orderId}`);
      const data = await res.json();
      setOrder(data.order);
      setStatus(data.order.status);
    } catch {} finally { setLoading(false); }
  }, [params.orderId]);

  const pollStatus = useCallback(async () => {
    if (document.visibilityState === 'hidden') return;
    try {
      const res = await fetch(`/api/orders/${params.orderId}/status`);
      const data = await res.json();
      setStatus(data.status);
      if (['ready', 'completed', 'cancelled'].includes(data.status)) {
        if (pollRef.current) clearInterval(pollRef.current);
      }
    } catch {}
  }, [params.orderId]);

  useEffect(() => {
    fetchOrder();
    fetch(`/api/menu/${params.slug}`).then(r => r.json()).then(d => setRestaurant(d.restaurant)).catch(() => {});
    pollRef.current = setInterval(pollStatus, POLL_INTERVALS.orderStatus);
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, [fetchOrder, pollStatus, params.slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0C0A08] flex items-center justify-center">
        <div className="h-64 w-80 bg-[#1C1714] rounded-2xl animate-pulse" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-[#0C0A08] flex items-center justify-center" dir="rtl">
        <p className="text-[#9B9189] font-arabic">الطلب غير موجود</p>
      </div>
    );
  }

  const currentStepIdx = STEPS.findIndex(s => s.key === status);
  const cs = restaurant?.currencySymbol || 'ر.س';
  const isCancelled = status === 'cancelled';
  const isReady = status === 'ready' || status === 'completed';
  const brandColor = restaurant?.primaryColor || '#D4A853';

  return (
    <div className="min-h-screen bg-[#0C0A08] noise-overlay" dir="rtl"
      style={{ '--brand-color': brandColor } as any}>
      <div className="max-w-[460px] mx-auto px-4 py-8 min-h-screen">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-[#F5F0EA] text-2xl font-cormorant font-bold">{restaurant?.name || ''}</h1>
          <p className="text-[#9B9189] text-sm mt-1 font-arabic">{UI_TEXT.orderNumber}</p>
        </div>

        <div className="bg-gradient-to-br from-[#1C1714] to-[#141210] border border-[#2E2924] rounded-2xl p-6 mb-6">

          {/* Order info */}
          <div className="text-center mb-6">
            <p className="font-cormorant text-3xl font-bold text-[var(--brand-color)]">{order.orderNumber}</p>
            <p className="text-[#9B9189] text-sm mt-1 font-arabic">
              {UI_TEXT.tableIndicator} {order.tableNumber}{order.tableLabel ? ` — ${order.tableLabel}` : ''}
            </p>
            <p className="text-[#9B9189] text-xs mt-1 font-arabic">
              {formatDistanceToNow(new Date(order.createdAt), { addSuffix: true, locale: ar })}
            </p>
          </div>

          {/* Ready banner */}
          {isReady && (
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 text-center mb-6">
              <Bell size={32} className="text-green-400 mx-auto mb-2" />
              <p className="text-green-400 font-semibold text-lg font-arabic">{UI_TEXT.orderReady}</p>
            </motion.div>
          )}

          {/* Cancelled banner */}
          {isCancelled && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-center mb-6">
              <XCircle size={32} className="text-red-400 mx-auto mb-2" />
              <p className="text-red-400 font-semibold font-arabic">{UI_TEXT.orderCancelled}</p>
            </div>
          )}

          {/* Vertical stepper */}
          {!isCancelled && (
            <div className="mb-6 pr-2">
              {STEPS.map((step, i) => {
                const isCompleted = i <= currentStepIdx;
                const isCurrent = i === currentStepIdx;
                const Icon = step.icon;
                return (
                  <div key={step.key} className="flex items-start gap-3">
                    {/* Line + Circle */}
                    <div className="flex flex-col items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                        isCurrent
                          ? 'bg-[var(--brand-color)]/20 ring-2 ring-[var(--brand-color)]/40 animate-pulse'
                          : isCompleted
                            ? 'bg-green-500/15'
                            : 'bg-[#1C1714] border border-[#2E2924]'
                      }`}>
                        {isCompleted && !isCurrent ? (
                          <CheckCircle size={18} className="text-green-400" />
                        ) : (
                          <Icon size={18} className={isCurrent ? 'text-[var(--brand-color)]' : 'text-[#9B9189]'} />
                        )}
                      </div>
                      {i < STEPS.length - 1 && (
                        <div className={`w-0.5 h-8 my-1 ${i < currentStepIdx ? 'bg-green-400/40' : 'bg-[#2E2924]'}`} />
                      )}
                    </div>
                    {/* Label */}
                    <div className="pt-2.5">
                      <p className={`text-sm font-medium font-arabic ${
                        isCurrent ? 'text-[var(--brand-color)]' : isCompleted ? 'text-green-400' : 'text-[#9B9189]'
                      }`}>
                        {step.label}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Gold divider */}
          <div className="h-px bg-[var(--brand-color)]/20 mb-4" />

          {/* Items */}
          <div className="space-y-2">
            {order.items.map((item: any, i: number) => (
              <div key={i} className="flex justify-between text-sm">
                <span className="text-[#F5F0EA] font-arabic">{item.quantity}× {item.name}</span>
                <span className="text-[#9B9189] font-cormorant">{(item.price * item.quantity).toFixed(0)} {cs}</span>
              </div>
            ))}
          </div>

          <div className="h-px bg-[var(--brand-color)]/20 my-4" />

          <div className="flex justify-between">
            <span className="text-[#9B9189] text-sm font-arabic">{UI_TEXT.subtotal}</span>
            <span className="text-[#F5F0EA] font-semibold font-cormorant text-lg">{order.subtotal.toFixed(0)} {cs}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

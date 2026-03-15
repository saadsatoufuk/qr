'use client';

import { useState } from 'react';
import { CheckCircle, ChefHat, Bell, MessageSquare } from 'lucide-react';
import { statusColors } from '@/lib/orderHelpers';
import { ADMIN_TEXT } from '@/lib/adminText';
import TimeElapsed from './TimeElapsed';
import ConfirmModal from '@/components/shared/ConfirmModal';

interface OrderCardProps {
  order: any;
  onStatusChange: (orderId: string, newStatus: string) => void;
  currencySymbol?: string;
}

const nextStatus: Record<string, string> = {
  pending: 'confirmed',
  confirmed: 'preparing',
  preparing: 'ready',
  ready: 'completed',
};

const actionLabels: Record<string, string> = {
  pending: ADMIN_TEXT.dashboard.confirmOrder,
  confirmed: ADMIN_TEXT.dashboard.startPreparing,
  preparing: ADMIN_TEXT.dashboard.markReady,
};

const actionIcons: Record<string, React.ReactNode> = {
  pending: <CheckCircle size={15} />,
  confirmed: <ChefHat size={15} />,
  preparing: <Bell size={15} />,
};

export default function OrderCard({ order, onStatusChange, currencySymbol = 'ر.س' }: OrderCardProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [showCancel, setShowCancel] = useState(false);
  const s = order.status;
  const colors = statusColors[s] || statusColors.pending;

  const handleAction = async (newStatus: string) => {
    setIsUpdating(true);
    await onStatusChange(order._id, newStatus);
    setIsUpdating(false);
  };

  return (
    <>
      <div className="bg-[#141414] border border-[#1E1E1E] rounded-2xl overflow-hidden hover:border-[#2E2E2E] transition-colors">
        {/* Header — table info */}
        <div className={`px-4 py-3 border-b border-[#1E1E1E] flex items-center justify-between ${colors.bg}`}>
          <div className="flex items-center gap-2">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${colors.bg} ${colors.text}`}>
              {order.tableNumber}
            </div>
            <div>
              <p className="text-[13px] font-semibold text-white leading-none">{order.tableLabel || `${ADMIN_TEXT.dashboard.guest}`}</p>
              <p className="text-[11px] text-[#666] mt-0.5">{order.orderNumber}</p>
            </div>
          </div>
          <div className="text-right">
            <TimeElapsed createdAt={order.createdAt} />
            <p className="text-[11px] text-[#666] mt-0.5">{order.customerName || ADMIN_TEXT.dashboard.guest}</p>
          </div>
        </div>

        {/* Body — items list */}
        <div className="px-4 py-3 border-b border-[#1E1E1E] space-y-1.5">
          {order.items.map((item: any, i: number) => (
            <div key={i} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <span className="w-6 h-6 rounded-md bg-[#1E1E1E] flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                  {item.quantity}
                </span>
                <span className="text-[#ccc] truncate">{item.name}</span>
              </div>
              <span className="text-[#888] text-xs flex-shrink-0 ml-2">
                {(item.price * item.quantity).toFixed(0)}
              </span>
            </div>
          ))}
          {order.notes && (
            <div className="mt-2 flex items-start gap-1.5 bg-[#1A1A1A] rounded-lg px-2.5 py-2">
              <MessageSquare size={11} className="text-[#555] mt-0.5 flex-shrink-0" />
              <p className="text-[11px] text-[#888] leading-relaxed">{order.notes}</p>
            </div>
          )}
        </div>

        {/* Footer — total + actions */}
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium
              ${order.paymentMethod === 'cash'
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
              }`}>
              {order.paymentMethod === 'cash' ? ADMIN_TEXT.dashboard.cash : ADMIN_TEXT.dashboard.card}
            </span>
            <span className="text-base font-bold text-white">
              {order.subtotal.toFixed(0)} <span className="text-xs text-[#666]">{currencySymbol}</span>
            </span>
          </div>

          {/* Primary action */}
          {nextStatus[s] && s !== 'ready' && (
            <button
              onClick={() => handleAction(nextStatus[s])}
              disabled={isUpdating}
              className={`w-full h-10 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98] mb-2
                ${s === 'pending'   ? 'bg-blue-600 hover:bg-blue-500 text-white'   : ''}
                ${s === 'confirmed' ? 'bg-orange-600 hover:bg-orange-500 text-white' : ''}
                ${s === 'preparing' ? 'bg-green-600 hover:bg-green-500 text-white'  : ''}
              `}
            >
              {isUpdating ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {actionIcons[s]}
                  {actionLabels[s]}
                </>
              )}
            </button>
          )}

          {/* Ready state */}
          {s === 'ready' && (
            <div className="space-y-2">
              <div className="w-full h-10 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center gap-2 text-green-400 text-sm font-medium">
                <CheckCircle size={15} />
                {ADMIN_TEXT.dashboard.readyForPickup}
              </div>
              <button onClick={() => handleAction('completed')}
                className="w-full h-8 rounded-lg bg-[#1E1E1E] text-[#888] text-xs hover:text-white transition-colors">
                {ADMIN_TEXT.dashboard.markCompleted}
              </button>
            </div>
          )}

          {/* Cancel button */}
          {!['completed', 'cancelled'].includes(s) && (
            <button onClick={() => setShowCancel(true)}
              className="w-full h-8 rounded-lg text-[#555] text-xs hover:text-red-400 hover:bg-red-500/5 transition-all mt-1">
              {ADMIN_TEXT.dashboard.cancelOrder}
            </button>
          )}
        </div>
      </div>

      <ConfirmModal
        isOpen={showCancel}
        title={ADMIN_TEXT.dashboard.cancelTitle}
        message={ADMIN_TEXT.dashboard.cancelMessage}
        confirmLabel={ADMIN_TEXT.dashboard.cancelOrder}
        confirmVariant="danger"
        onConfirm={() => { setShowCancel(false); handleAction('cancelled'); }}
        onCancel={() => setShowCancel(false)}
      />
    </>
  );
}

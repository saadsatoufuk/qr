'use client';

import OrderCard from './OrderCard';
import { statusColors } from '@/lib/orderHelpers';
import { ADMIN_TEXT } from '@/lib/adminText';

interface KanbanColumnProps {
  status: string;
  orders: any[];
  onStatusChange: (orderId: string, newStatus: string) => void;
  currencySymbol: string;
}

export default function KanbanColumn({ status, orders, onStatusChange, currencySymbol }: KanbanColumnProps) {
  const colors = statusColors[status] || statusColors.pending;
  const label = ADMIN_TEXT.orderStatus[status] || status;

  return (
    <div className="flex-shrink-0 w-[300px] flex flex-col">
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${colors.dot}`} />
          <h3 className="text-sm font-semibold text-white">{label}</h3>
        </div>
        <span className="text-xs font-bold text-[#666] bg-[#1A1A1A] px-2 py-0.5 rounded-full">
          {orders.length}
        </span>
      </div>

      <div className="flex flex-col gap-3 min-h-[120px]">
        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 border border-dashed border-[#1E1E1E] rounded-2xl">
            <p className="text-xs text-[#444]">{ADMIN_TEXT.dashboard.noOrders}</p>
          </div>
        ) : (
          orders.map(order => (
            <OrderCard
              key={order._id}
              order={order}
              onStatusChange={onStatusChange}
              currencySymbol={currencySymbol}
            />
          ))
        )}
      </div>
    </div>
  );
}

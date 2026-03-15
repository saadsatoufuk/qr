'use client';

import { useState, useEffect, useCallback } from 'react';
import { Search, Download, ChevronLeft, ChevronRight, X } from 'lucide-react';
import StatusBadge from '@/components/shared/StatusBadge';
import { ADMIN_TEXT } from '@/lib/adminText';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState<any>(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [orderSearch, setOrderSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const statuses = ['pending','confirmed','preparing','ready','completed','cancelled'];

  const fetchOrders = useCallback(async () => {
    const p = new URLSearchParams({ page: String(page), limit: '20' });
    if (statusFilter) p.set('status', statusFilter);
    if (orderSearch) p.set('orderNumber', orderSearch);
    try {
      const res = await fetch(`/api/orders?${p}`);
      const data = await res.json();
      setOrders(data.orders || []);
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 1);
    } catch {} finally { setLoading(false); }
  }, [page, statusFilter, orderSearch]);

  useEffect(() => { fetch('/api/settings').then(r=>r.json()).then(d=>setSettings(d.restaurant)).catch(()=>{}); }, []);
  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const exportCSV = () => {
    const headers = [ADMIN_TEXT.orders.colOrderNumber, ADMIN_TEXT.orders.colTable, ADMIN_TEXT.orders.colCustomer, ADMIN_TEXT.orders.colItems, ADMIN_TEXT.orders.colTotal, ADMIN_TEXT.orders.colPayment, ADMIN_TEXT.orders.colStatus, ADMIN_TEXT.orders.colDate];
    const rows = [headers.join(',')];
    orders.forEach(o => {
      const items = o.items.map((i:any)=>`${i.quantity}x ${i.name}`).join('; ');
      rows.push(`${o.orderNumber},${o.tableNumber},${o.customerName||''},${items},${o.subtotal},${o.paymentMethod},${ADMIN_TEXT.orderStatus[o.status] || o.status},${format(new Date(o.createdAt),'yyyy-MM-dd HH:mm')}`);
    });
    const blob = new Blob([rows.join('\n')], { type: 'text/csv' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `orders.csv`; a.click();
  };

  const cs = settings?.currencySymbol || 'ر.س';

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h1 className="text-2xl font-semibold text-white">{ADMIN_TEXT.orders.title}</h1>
        <button onClick={exportCSV} className="flex items-center gap-2 px-4 py-2 border border-admin-border rounded-lg text-sm text-gray-400 hover:text-white transition-colors">
          <Download size={16} /> {ADMIN_TEXT.orders.exportCsv}
        </button>
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-[160px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input value={orderSearch} onChange={e=>{setOrderSearch(e.target.value);setPage(1);}}
            className="w-full bg-admin-bg border border-admin-border rounded-lg pl-9 pr-4 py-2 text-white text-sm focus:outline-none" placeholder={ADMIN_TEXT.orders.filterSearch} />
        </div>
        <select value={statusFilter} onChange={e=>{setStatusFilter(e.target.value);setPage(1);}}
          className="bg-admin-bg border border-admin-border rounded-lg px-3 py-2 text-white text-sm focus:outline-none">
          <option value="">{ADMIN_TEXT.orders.allStatuses}</option>
          {statuses.map(s=><option key={s} value={s}>{ADMIN_TEXT.orderStatus[s] || s}</option>)}
        </select>
      </div>

      <div className="bg-admin-card border border-admin-border rounded-xl overflow-x-auto">
        <table className="w-full">
          <thead><tr className="border-b border-admin-border">
            {[ADMIN_TEXT.orders.colOrderNumber, ADMIN_TEXT.orders.colTable, ADMIN_TEXT.orders.colCustomer, ADMIN_TEXT.orders.colItems, ADMIN_TEXT.orders.colTotal, ADMIN_TEXT.orders.colStatus, ADMIN_TEXT.orders.colDate].map(h=>(
              <th key={h} className="text-left px-4 py-3 text-gray-500 text-xs font-medium whitespace-nowrap">{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {orders.map((o,i)=>(
              <tr key={o._id} onClick={()=>setSelectedOrder(o)} className={`border-b border-admin-border/50 cursor-pointer hover:bg-white/[0.02] ${i%2===1?'bg-admin-row':''}`}>
                <td className="px-4 py-3 text-white text-sm font-medium">{o.orderNumber}</td>
                <td className="px-4 py-3"><span className="text-xs px-2 py-0.5 rounded-full bg-admin-gold/10 text-admin-gold">{o.tableNumber}</span></td>
                <td className="px-4 py-3 text-gray-400 text-sm">{o.customerName||'—'}</td>
                <td className="px-4 py-3 text-gray-400 text-sm">{o.items.reduce((s:number,i:any)=>s+i.quantity,0)}</td>
                <td className="px-4 py-3 text-admin-gold text-sm font-medium">{o.subtotal} {cs}</td>
                <td className="px-4 py-3"><StatusBadge status={o.status}/></td>
                <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">{format(new Date(o.createdAt),'dd MMM yyyy - hh:mm a', { locale: ar })}</td>
              </tr>
            ))}
            {orders.length===0&&!loading&&<tr><td colSpan={7} className="text-center py-12 text-gray-500 text-sm">{statusFilter || orderSearch ? ADMIN_TEXT.orders.noOrdersFiltered : ADMIN_TEXT.orders.noOrders}</td></tr>}
          </tbody>
        </table>
      </div>

      {totalPages>1&&(
        <div className="flex items-center justify-between mt-4">
          <p className="text-gray-500 text-sm">{total} {ADMIN_TEXT.orders.colItems}</p>
          <div className="flex items-center gap-2">
            <button onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={page===1} className="p-2 rounded-lg border border-admin-border text-gray-400 disabled:opacity-30"><ChevronLeft size={16}/></button>
            <span className="text-gray-400 text-sm">{ADMIN_TEXT.orders.page} {page} {ADMIN_TEXT.orders.of} {totalPages}</span>
            <button onClick={()=>setPage(p=>Math.min(totalPages,p+1))} disabled={page===totalPages} className="p-2 rounded-lg border border-admin-border text-gray-400 disabled:opacity-30"><ChevronRight size={16}/></button>
          </div>
        </div>
      )}

      {selectedOrder&&(
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/60" onClick={()=>setSelectedOrder(null)}/>
          <div className="relative bg-admin-card border-l border-admin-border w-full max-w-md h-full overflow-y-auto">
            <div className="sticky top-0 bg-admin-card border-b border-admin-border px-6 py-4 flex items-center justify-between">
              <h3 className="text-white font-semibold">{ADMIN_TEXT.orders.orderDetail} — {selectedOrder.orderNumber}</h3>
              <button onClick={()=>setSelectedOrder(null)} className="text-gray-500 hover:text-white"><X size={18}/></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex gap-3"><StatusBadge status={selectedOrder.status}/><span className="text-xs px-2 py-0.5 rounded-full bg-admin-gold/10 text-admin-gold">{selectedOrder.tableNumber}</span></div>
              <p className="text-gray-500 text-xs">{ADMIN_TEXT.orders.placedAt}: {format(new Date(selectedOrder.createdAt),'dd MMM yyyy - hh:mm a', { locale: ar })}</p>
              <h4 className="text-gray-400 text-xs font-medium">{ADMIN_TEXT.orders.orderItems}</h4>
              {selectedOrder.items.map((item:any,i:number)=>(<div key={i} className="flex justify-between"><p className="text-white text-sm">{item.quantity}× {item.name}</p><p className="text-gray-400 text-sm">{item.price*item.quantity} {cs}</p></div>))}
              {selectedOrder.notes && (
                <div>
                  <h4 className="text-gray-400 text-xs font-medium mb-1">{ADMIN_TEXT.orders.orderNotes}</h4>
                  <p className="text-gray-300 text-sm">{selectedOrder.notes}</p>
                </div>
              )}
              <div className="gold-divider"/>
              <div className="flex justify-between"><span className="text-gray-400">{ADMIN_TEXT.orders.subtotal}</span><span className="text-white font-medium">{selectedOrder.subtotal} {cs}</span></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

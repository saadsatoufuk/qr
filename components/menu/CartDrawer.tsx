'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, Trash2, Send } from 'lucide-react';
import { useCartStore } from '@/lib/cartStore';
import { UI_TEXT } from '@/lib/orderHelpers';
import toast from 'react-hot-toast';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  slug: string;
  currencySymbol: string;
  onOrderPlaced: (orderId: string, orderNumber: string, estimatedWait: number) => void;
}

export default function CartDrawer({ isOpen, onClose, slug, currencySymbol, onOrderPlaced }: CartDrawerProps) {
  const { items, tableNumber, tableLabel, updateQuantity, removeItem, getSubtotal, clearCart } = useCartStore();
  const [customerName, setCustomerName] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card'>('cash');
  const [placing, setPlacing] = useState(false);

  const subtotal = getSubtotal();

  const placeOrder = async () => {
    if (items.length === 0) return;
    setPlacing(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug, tableNumber,
          items: items.map(i => ({ itemId: i.itemId, name: i.name, price: i.price, quantity: i.quantity, notes: i.notes })),
          customerName: customerName || null, paymentMethod, notes,
        }),
      });
      if (!res.ok) {
        const d = await res.json();
        toast.error(d.error || 'فشل في إرسال الطلب');
        setPlacing(false);
        return;
      }
      const data = await res.json();
      clearCart();
      onClose();
      onOrderPlaced(data.order._id, data.order.orderNumber, data.estimatedWaitMinutes);
    } catch {
      toast.error('فشل في إرسال الطلب');
      setPlacing(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-[#0F0D0B] rounded-t-3xl border-t border-[#2E2924] max-w-[460px] mx-auto flex flex-col"
            style={{ maxHeight: '92vh' }}
            dir="rtl"
          >
            {/* Drag handle */}
            <div className="flex justify-center pt-3 pb-2 flex-shrink-0">
              <div className="w-10 h-1 rounded-full bg-[#2E2924]" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-5 pb-4 border-b border-[#2E2924] flex-shrink-0">
              <div>
                <h2 className="text-lg font-semibold text-[#F5F0EA] font-arabic">{UI_TEXT.yourOrder}</h2>
                <p className="text-xs text-[#9B9189] mt-0.5 font-arabic">{UI_TEXT.tableIndicator} {tableNumber}{tableLabel ? ` — ${tableLabel}` : ''}</p>
              </div>
              <button onClick={onClose} className="w-8 h-8 flex items-center justify-center text-[#9B9189] hover:text-[#F5F0EA]">
                <X size={18} />
              </button>
            </div>

            {/* Items list */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
              {items.length === 0 ? (
                <p className="text-[#9B9189] text-sm text-center py-8 font-arabic">{UI_TEXT.emptyCart}</p>
              ) : (
                items.map((item) => (
                  <div key={item.itemId} className="flex items-center gap-3 bg-[#1C1714] border border-[#2E2924] rounded-xl p-3">
                    {/* Quantity controls */}
                    <div className="flex items-center gap-2 bg-[#0F0D0B] rounded-lg px-2 py-1">
                      <button onClick={() => item.quantity === 1 ? removeItem(item.itemId) : updateQuantity(item.itemId, item.quantity - 1)}
                        className="text-[#9B9189] hover:text-red-400 transition-colors">
                        {item.quantity === 1 ? <Trash2 size={14} /> : <Minus size={14} />}
                      </button>
                      <span className="font-cormorant text-sm font-semibold text-[#F5F0EA] w-5 text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.itemId, item.quantity + 1)} className="text-[var(--brand-color)]">
                        <Plus size={14} />
                      </button>
                    </div>

                    {/* Item info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#F5F0EA] truncate font-arabic">{item.name}</p>
                      {item.notes && <p className="text-[11px] text-[#9B9189] truncate mt-0.5 font-arabic">{item.notes}</p>}
                    </div>

                    {/* Price */}
                    <span className="font-cormorant text-sm font-semibold text-[var(--brand-color)] flex-shrink-0">
                      {(item.price * item.quantity).toFixed(0)} {currencySymbol}
                    </span>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="flex-shrink-0 border-t border-[#2E2924] px-5 pt-4 pb-8 space-y-3">
                {/* Subtotal */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#9B9189] font-arabic">{UI_TEXT.subtotal}</span>
                  <span className="font-cormorant text-xl font-semibold text-[#F5F0EA]">
                    {subtotal.toFixed(0)} {currencySymbol}
                  </span>
                </div>

                <div className="h-px bg-[var(--brand-color)]/20" />

                {/* Customer name */}
                <input value={customerName} onChange={e => setCustomerName(e.target.value)}
                  placeholder={UI_TEXT.yourName}
                  className="w-full bg-[#1C1714] border border-[#2E2924] rounded-xl px-4 py-3 text-sm text-[#F5F0EA] placeholder-[#9B9189] focus:border-[var(--brand-color)]/50 focus:outline-none font-arabic"
                />

                {/* Order notes */}
                <textarea value={notes} onChange={e => setNotes(e.target.value)}
                  placeholder={UI_TEXT.orderNotes} rows={2}
                  className="w-full bg-[#1C1714] border border-[#2E2924] rounded-xl px-4 py-3 text-sm text-[#F5F0EA] placeholder-[#9B9189] resize-none focus:border-[var(--brand-color)]/50 focus:outline-none font-arabic"
                />

                {/* Payment method */}
                <div>
                  <p className="text-xs text-[#9B9189] mb-2 font-arabic">{UI_TEXT.paymentMethod}</p>
                  <div className="grid grid-cols-2 gap-2">
                    {(['cash', 'card'] as const).map(m => (
                      <button key={m} onClick={() => setPaymentMethod(m)}
                        className={`py-2.5 rounded-xl text-sm font-medium transition-all border font-arabic
                          ${paymentMethod === m
                            ? 'bg-[var(--brand-color)]/10 border-[var(--brand-color)]/50 text-[var(--brand-color)]'
                            : 'bg-[#1C1714] border-[#2E2924] text-[#9B9189]'
                          }`}>
                        {m === 'cash' ? UI_TEXT.cash : UI_TEXT.card}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Place order */}
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={placeOrder} disabled={placing}
                  className="w-full h-14 rounded-2xl bg-[var(--brand-color)] text-[#0C0A08] font-bold text-base flex items-center justify-center gap-2 shadow-xl shadow-[var(--brand-color)]/20 disabled:opacity-60 font-arabic"
                >
                  {placing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-[#0C0A08]/40 border-t-[#0C0A08] rounded-full animate-spin" />
                      {UI_TEXT.sending}
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      {UI_TEXT.placeOrder}
                    </>
                  )}
                </motion.button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

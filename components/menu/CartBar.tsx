'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, ChevronUp } from 'lucide-react';
import { useCartStore } from '@/lib/cartStore';
import { UI_TEXT } from '@/lib/orderHelpers';

interface CartBarProps {
  currencySymbol: string;
  onOpen: () => void;
}

export default function CartBar({ currencySymbol, onOpen }: CartBarProps) {
  const getSubtotal = useCartStore((s) => s.getSubtotal);
  const getItemCount = useCartStore((s) => s.getItemCount);

  const count = getItemCount();
  const subtotal = getSubtotal();

  return (
    <AnimatePresence>
      {count > 0 && (
        <motion.div
          initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed bottom-0 left-0 right-0 z-30 pb-safe max-w-[460px] mx-auto px-4 pb-4"
          dir="rtl"
        >
          <button
            onClick={onOpen}
            className="w-full bg-[var(--brand-color)] text-[#0C0A08] rounded-2xl px-5 py-4 flex items-center justify-between shadow-2xl shadow-[var(--brand-color)]/20 hover:opacity-95 transition-opacity"
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <ShoppingBag size={20} strokeWidth={2} />
                <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-[#0C0A08] text-[var(--brand-color)] text-[10px] font-bold flex items-center justify-center">
                  {count}
                </span>
              </div>
              <span className="font-semibold text-sm font-arabic">{UI_TEXT.yourOrder}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold font-cormorant text-lg">{subtotal.toFixed(0)} {currencySymbol}</span>
              <ChevronUp size={18} />
            </div>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

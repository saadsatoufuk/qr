'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';
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
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: 'spring', damping: 22, stiffness: 260 }}
          className="fixed bottom-6 left-0 right-0 z-30 flex justify-center px-5"
          dir="rtl"
        >
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={onOpen}
            className="
              w-full max-w-[420px] h-14 rounded-2xl
              bg-[var(--brand-color)] text-[#0C0A08]
              flex items-center justify-between px-6
              shadow-2xl shadow-[var(--brand-color)]/30
              hover:brightness-110 transition-all duration-200
              font-arabic
            "
          >
            {/* Right side: icon + label */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <ShoppingBag size={20} strokeWidth={2.2} />
                <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-[#0C0A08] text-[var(--brand-color)] text-[10px] font-bold flex items-center justify-center">
                  {count}
                </span>
              </div>
              <span className="font-bold text-[15px]">
                {UI_TEXT.continueOrder}
              </span>
            </div>

            {/* Left side: price */}
            <span className="font-bold font-cormorant text-lg">
              {subtotal.toFixed(0)} {currencySymbol}
            </span>
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

'use client';

import { Plus, UtensilsCrossed } from 'lucide-react';
import { motion } from 'framer-motion';
import { UI_TEXT } from '@/lib/orderHelpers';

interface ItemCardProps {
  item: any;
  onTap: () => void;
  currencySymbol: string;
  index: number;
}

export default function ItemCard({ item, onTap, currencySymbol, index }: ItemCardProps) {
  const isSoldOut = item.badge === 'sold_out' || !item.isAvailable;

  const badgeLabels: Record<string, { label: string; cls: string }> = {
    new:          { label: UI_TEXT.new,         cls: 'bg-blue-500/20 text-blue-300 border border-blue-500/30' },
    popular:      { label: UI_TEXT.popular,     cls: 'bg-orange-500/20 text-orange-300 border border-orange-500/30' },
    chef_special: { label: UI_TEXT.chefSpecial,  cls: 'bg-[var(--brand-color)]/20 text-[var(--brand-color)] border border-[var(--brand-color)]/30' },
    offer:        { label: UI_TEXT.offer,       cls: 'bg-red-500/20 text-red-300 border border-red-500/30' },
  };

  const badge = item.badge && item.badge !== 'sold_out' ? badgeLabels[item.badge] : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      onClick={onTap}
      className={`
        relative flex items-start gap-3 p-4 rounded-2xl cursor-pointer
        bg-gradient-to-br from-[#1C1714] to-[#141210]
        border border-[#2E2924] mb-3
        transition-all duration-200 active:scale-[0.98]
        hover:border-[var(--brand-color)]/30 hover:shadow-lg hover:shadow-black/40
        ${isSoldOut ? 'opacity-50 pointer-events-none' : ''}
      `}
    >
      {/* Text content — first in DOM = right side in RTL */}
      <div className="flex-1 min-w-0 pt-1 flex flex-col justify-between min-h-[80px]">
        <div>
          {/* Item name + badge in same row */}
          <div className="flex items-center flex-wrap gap-1.5 mb-1">
            <h3 className="text-[15px] font-semibold text-[#F5F0EA] leading-snug font-arabic">
              {item.nameAr || item.name}
            </h3>
            {badge && (
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full font-arabic whitespace-nowrap ${badge.cls}`}>
                {badge.label}
              </span>
            )}
          </div>
          {(item.descriptionAr || item.description) && (
            <p className="text-[12px] text-[#9B9189] line-clamp-2 leading-relaxed mb-2 font-arabic">
              {item.descriptionAr || item.description}
            </p>
          )}
        </div>

        {/* Price + Add button */}
        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-baseline gap-1.5">
            {item.offerPrice ? (
              <>
                <span className="font-cormorant text-lg font-semibold text-[var(--brand-color)]">
                  {item.offerPrice} {currencySymbol}
                </span>
                <span className="font-cormorant text-sm text-[#9B9189] line-through">
                  {item.price}
                </span>
              </>
            ) : (
              <span className="font-cormorant text-lg font-semibold text-[var(--brand-color)]">
                {item.price} {currencySymbol}
              </span>
            )}
          </div>

          {!isSoldOut ? (
            <motion.button
              whileTap={{ scale: 0.88 }}
              onClick={(e) => { e.stopPropagation(); onTap(); }}
              className="w-9 h-9 rounded-full bg-[var(--brand-color)] flex items-center justify-center
                         shadow-lg shadow-[var(--brand-color)]/25 active:shadow-none transition-shadow"
            >
              <Plus size={18} strokeWidth={2.5} className="text-[#0C0A08]" />
            </motion.button>
          ) : (
            <span className="text-xs text-[#9B9189] bg-[#2E2924] px-2.5 py-1 rounded-full font-arabic">
              {UI_TEXT.soldOut}
            </span>
          )}
        </div>
      </div>

      {/* Image — second in DOM = left side in RTL */}
      <div className="relative w-[88px] h-[88px] flex-shrink-0 rounded-xl overflow-hidden bg-[#2E2924]">
        {item.image ? (
          <img src={item.image} alt={item.name} className="w-full h-full object-cover" loading="lazy" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <UtensilsCrossed size={28} className="text-[#3E3630]" />
          </div>
        )}
      </div>
    </motion.div>
  );
}

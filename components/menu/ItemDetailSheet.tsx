'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, Clock, Flame } from 'lucide-react';
import { useCartStore } from '@/lib/cartStore';
import { UI_TEXT, allergenLabelsAr } from '@/lib/orderHelpers';

interface ItemDetailSheetProps {
  item: any;
  isOpen: boolean;
  onClose: () => void;
  currencySymbol: string;
}

export default function ItemDetailSheet({ item, isOpen, onClose, currencySymbol }: ItemDetailSheetProps) {
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');
  const addItem = useCartStore((s) => s.addItem);

  const handleAdd = () => {
    const price = item.offerPrice || item.price;
    addItem({ itemId: item._id, name: item.nameAr || item.name, price, image: item.image || '', quantity, notes });
    setQuantity(1);
    setNotes('');
    onClose();
  };

  const isSoldOut = item?.badge === 'sold_out' || !item?.isAvailable;

  return (
    <AnimatePresence>
      {isOpen && item && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm" onClick={onClose}
          />
          <motion.div
            initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-[#141210] rounded-t-3xl max-h-[92vh] overflow-y-auto"
            dir="rtl"
          >
            <div className="w-10 h-1 bg-[#2E2924] rounded-full mx-auto mt-3" />
            <button onClick={onClose}
              className="absolute top-4 left-4 z-10 w-8 h-8 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center text-white">
              <X size={16} />
            </button>

            {item.image && (
              <div className="relative h-[220px] w-full">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#141210] via-transparent to-transparent" />
              </div>
            )}

            <div className="p-5 space-y-4">
              {/* Name + Price */}
              <div className="flex items-start justify-between">
                <h2 className="text-xl font-semibold text-[#F5F0EA] flex-1 font-arabic">
                  {item.nameAr || item.name}
                </h2>
                <div className="text-left mr-3">
                  <span className="font-cormorant text-2xl font-semibold text-[var(--brand-color)]">
                    {item.offerPrice || item.price} {currencySymbol}
                  </span>
                  {item.offerPrice && (
                    <span className="block font-cormorant text-sm text-[#9B9189] line-through">
                      {item.price} {currencySymbol}
                    </span>
                  )}
                </div>
              </div>

              {/* Description */}
              {(item.descriptionAr || item.description) && (
                <p className="text-sm text-[#9B9189] leading-relaxed font-arabic">
                  {item.descriptionAr || item.description}
                </p>
              )}

              {/* Metadata chips */}
              <div className="flex flex-wrap gap-2">
                {item.calories && (
                  <div className="flex items-center gap-1 text-xs text-[#9B9189] bg-[#1C1714] border border-[#2E2924] px-2.5 py-1 rounded-full font-arabic">
                    <Flame size={11} />
                    <span>{item.calories} {UI_TEXT.calories}</span>
                  </div>
                )}
                {item.preparationMinutes && (
                  <div className="flex items-center gap-1 text-xs text-[#9B9189] bg-[#1C1714] border border-[#2E2924] px-2.5 py-1 rounded-full font-arabic">
                    <Clock size={11} />
                    <span>{item.preparationMinutes} {UI_TEXT.minutes}</span>
                  </div>
                )}
              </div>

              {/* Allergens */}
              {item.allergens?.length > 0 && (
                <div>
                  <p className="text-xs text-[#9B9189] mb-2 font-medium font-arabic">يحتوي على:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {item.allergens.map((a: string) => (
                      <span key={a} className="text-xs bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded-full font-arabic">
                        {allergenLabelsAr[a] || a}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {!isSoldOut && (
                <>
                  {/* Special requests */}
                  <textarea
                    value={notes} onChange={(e) => setNotes(e.target.value)}
                    placeholder={`${UI_TEXT.specialRequests}...`}
                    rows={2}
                    className="w-full bg-[#1C1714] border border-[#2E2924] rounded-xl px-4 py-3 text-sm text-[#F5F0EA] placeholder-[#9B9189] resize-none focus:border-[var(--brand-color)]/50 focus:outline-none transition-colors font-arabic"
                  />

                  {/* Quantity + Add */}
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-3 bg-[#1C1714] border border-[#2E2924] rounded-xl px-3 py-2">
                      <button onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-7 h-7 flex items-center justify-center text-[#9B9189] hover:text-[#F5F0EA] transition-colors">
                        <Minus size={16} />
                      </button>
                      <span className="font-cormorant text-lg font-semibold text-[#F5F0EA] w-6 text-center">{quantity}</span>
                      <button onClick={() => setQuantity(quantity + 1)}
                        className="w-7 h-7 flex items-center justify-center text-[var(--brand-color)]">
                        <Plus size={16} />
                      </button>
                    </div>

                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      onClick={handleAdd}
                      className="flex-1 h-12 rounded-xl bg-[var(--brand-color)] text-[#0C0A08] font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-[var(--brand-color)]/20 font-arabic"
                    >
                      <Plus size={16} />
                      {UI_TEXT.addToOrder} · {((item.offerPrice || item.price) * quantity).toFixed(0)} {currencySymbol}
                    </motion.button>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

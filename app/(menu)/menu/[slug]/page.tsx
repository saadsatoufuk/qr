'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useCartStore } from '@/lib/cartStore';
import { UI_TEXT } from '@/lib/orderHelpers';
import CategoryTabs from '@/components/menu/CategoryTabs';
import ItemCard from '@/components/menu/ItemCard';
import ItemDetailSheet from '@/components/menu/ItemDetailSheet';
import CartBar from '@/components/menu/CartBar';
import CartDrawer from '@/components/menu/CartDrawer';
import { motion } from 'framer-motion';
import { MapPin, CheckCircle2, Clock, Navigation, QrCode } from 'lucide-react';

export default function MenuPage({ params }: { params: { slug: string } }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tableParam = searchParams.get('table');

  const [restaurant, setRestaurant] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [items, setItems] = useState<any[]>([]);
  const [tableInfo, setTableInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('');
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [noTable, setNoTable] = useState(false);
  const [success, setSuccess] = useState<{ orderId: string; orderNumber: string; wait: number } | null>(null);

  const setTable = useCartStore((s) => s.setTable);
  const addItem = useCartStore((s) => s.addItem);
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const fetchMenu = useCallback(async () => {
    try {
      const url = `/api/menu/${params.slug}${tableParam ? `?table=${tableParam}` : ''}`;
      const res = await fetch(url);
      const data = await res.json();
      if (!res.ok || !data.restaurant) { setLoading(false); return; }
      setRestaurant(data.restaurant);
      setCategories(data.categories || []);
      setItems(data.items || []);
      if (data.categories?.length) setActiveCategory(data.categories[0]._id);
      if (data.table) {
        setTableInfo(data.table);
        setTable(data.table.tableNumber, data.table.label || '', data.table._id);
      } else if (!tableParam) {
        setNoTable(true);
      }
    } catch {} finally { setLoading(false); }
  }, [params.slug, tableParam, setTable]);

  useEffect(() => { fetchMenu(); }, [fetchMenu]);

  // Scroll-based active category
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveCategory(entry.target.id.replace('section-', ''));
        });
      },
      { rootMargin: '-100px 0px -70% 0px' }
    );
    Object.values(sectionRefs.current).forEach((el) => { if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, [categories]);

  const scrollToCategory = (id: string) => {
    setActiveCategory(id);
    sectionRefs.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleOrderPlaced = (orderId: string, orderNumber: string, wait: number) => {
    setSuccess({ orderId, orderNumber, wait });
  };

  // Loading skeleton
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0C0A08]">
        <div className="max-w-[460px] mx-auto">
          <div className="h-[220px] bg-[#1C1714] animate-pulse" />
          <div className="px-4 pt-4 space-y-3">
            <div className="h-8 w-48 bg-[#1C1714] rounded-lg animate-pulse" />
            <div className="h-4 w-64 bg-[#1C1714] rounded-lg animate-pulse" />
            {[1,2,3].map(i => <div key={i} className="h-24 bg-[#1C1714] rounded-2xl animate-pulse" />)}
          </div>
        </div>
      </div>
    );
  }

  // Restaurant not found
  if (!restaurant) {
    return (
      <div className="min-h-screen bg-[#0C0A08] flex items-center justify-center" dir="rtl">
        <div className="text-center px-6">
          <p className="text-[#F5F0EA] text-xl font-cormorant mb-2">{UI_TEXT.menuUnavailable}</p>
        </div>
      </div>
    );
  }

  // No table — scan QR
  if (noTable) {
    return (
      <div className="min-h-screen bg-[#0C0A08] flex items-center justify-center" dir="rtl"
        style={{ '--brand-color': restaurant.primaryColor } as any}>
        <div className="text-center px-6">
          <QrCode size={48} className="text-[var(--brand-color)] mx-auto mb-4 opacity-60" />
          <p className="text-[#F5F0EA] text-xl font-arabic font-semibold mb-2">{UI_TEXT.noTableError}</p>
          <p className="text-[#9B9189] text-sm font-arabic">{UI_TEXT.noTableSub}</p>
        </div>
      </div>
    );
  }

  // Success overlay
  if (success) {
    return (
      <div className="min-h-screen bg-[#0C0A08] flex flex-col items-center justify-center px-6" dir="rtl"
        style={{ '--brand-color': restaurant.primaryColor } as any}>
        <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} className="text-center">
          <motion.div
            initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.1, stiffness: 200 }}
            className="w-24 h-24 rounded-full bg-green-500/10 border-2 border-green-500/30 flex items-center justify-center mx-auto mb-6"
          >
            <motion.svg width="40" height="40" viewBox="0 0 40 40">
              <motion.path d="M8 20 L16 28 L32 12" stroke="#4ade80" strokeWidth="3"
                strokeLinecap="round" strokeLinejoin="round" fill="none"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, delay: 0.3 }} />
            </motion.svg>
          </motion.div>
          <h2 className="text-2xl font-semibold text-[#F5F0EA] mb-2 font-arabic">{UI_TEXT.orderPlaced}</h2>
          <p className="text-[#9B9189] text-sm mb-1 font-arabic">{UI_TEXT.orderNumber}</p>
          <p className="font-cormorant text-3xl font-bold text-[var(--brand-color)] mb-6">{success.orderNumber}</p>
          <div className="flex items-center justify-center gap-2 text-sm text-[#9B9189] mb-8 font-arabic">
            <Clock size={14} />
            <span>{UI_TEXT.estimatedWait}: ~{success.wait} {UI_TEXT.minutes}</span>
          </div>
          <button onClick={() => router.push(`/menu/${params.slug}/order/${success.orderId}`)}
            className="w-full max-w-xs h-12 rounded-xl bg-[var(--brand-color)] text-[#0C0A08] font-semibold flex items-center justify-center gap-2 font-arabic">
            <Navigation size={16} />
            {UI_TEXT.trackOrder}
          </button>
        </motion.div>
      </div>
    );
  }

  const cs = restaurant.currencySymbol || 'ر.س';

  return (
    <div className="min-h-screen bg-[#0C0A08] noise-overlay" dir="rtl"
      style={{ '--brand-color': restaurant.primaryColor } as any}>
      <div className="max-w-[460px] mx-auto shadow-2xl shadow-black/50 min-h-screen bg-[#0C0A08] relative">

        {/* Cover Image */}
        <div className="relative h-[220px] w-full overflow-hidden">
          {restaurant.coverImage ? (
            <img src={restaurant.coverImage} alt={restaurant.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#1C1714] to-[#0C0A08]" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0C0A08] via-[#0C0A08]/40 to-transparent" />

          {/* Table badge */}
          {tableInfo && (
            <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-black/60 backdrop-blur-sm border border-[var(--brand-color)]/40 rounded-full px-3 py-1.5">
              <MapPin size={12} className="text-[var(--brand-color)]" />
              <span className="text-xs font-medium text-[var(--brand-color)] font-arabic">
                {UI_TEXT.tableIndicator} {tableInfo.tableNumber}{tableInfo.label ? ` — ${tableInfo.label}` : ''}
              </span>
            </div>
          )}
        </div>

        {/* Logo + Info */}
        <div className="relative px-4 pb-4">
          {restaurant.logo && (
            <div className="relative -mt-10 mb-3 w-20 h-20 rounded-2xl overflow-hidden ring-2 ring-[var(--brand-color)]/60 shadow-2xl shadow-black/60 bg-[#1C1714]">
              <img src={restaurant.logo} alt={restaurant.name} className="w-full h-full object-cover" />
            </div>
          )}

          <h1 className="font-cormorant text-2xl font-semibold text-[#F5F0EA] leading-tight mb-1">
            {restaurant.name}
          </h1>

          <div className="flex items-center gap-2 mb-2">
            <span className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium font-arabic
              ${restaurant.isOpen
                ? 'bg-green-500/15 text-green-400 border border-green-500/20'
                : 'bg-red-500/15 text-red-400 border border-red-500/20'
              }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${restaurant.isOpen ? 'bg-green-400' : 'bg-red-400'}`} />
              {restaurant.isOpen ? UI_TEXT.restaurantOpen : UI_TEXT.restaurantClosed}
            </span>
          </div>

          {restaurant.description && (
            <p className="text-sm text-[#9B9189] line-clamp-2 leading-relaxed font-arabic">{restaurant.description}</p>
          )}
        </div>

        {/* Gold divider */}
        <div className="mx-4 h-px bg-[var(--brand-color)]/20 mb-0" />

        {/* Category Tabs */}
        <CategoryTabs categories={categories} activeId={activeCategory} onSelect={scrollToCategory} />

        {/* Menu Items */}
        <div className="px-4 pt-4 pb-28 space-y-6">
          {categories.map((cat) => {
            const catItems = items.filter((i) => i.categoryId === cat._id);
            if (catItems.length === 0) return null;
            return (
              <div key={cat._id} id={`section-${cat._id}`} ref={(el) => { sectionRefs.current[cat._id] = el; }}>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg">{cat.emoji}</span>
                  <h2 className="text-[#F5F0EA] text-lg font-cormorant font-semibold">{cat.nameAr || cat.name}</h2>
                </div>
                <div>
                  {catItems.map((item, idx) => (
                    <ItemCard
                      key={item._id} item={item} index={idx} currencySymbol={cs}
                      onTap={() => setSelectedItem(item)}
                      onAdd={() => addItem({ itemId: item._id, name: item.nameAr || item.name, price: item.offerPrice || item.price, image: item.image || '' })}
                    />
                  ))}
                </div>
                <div className="h-px bg-[var(--brand-color)]/10 mt-2" />
              </div>
            );
          })}
        </div>

        {/* Cart + Sheets */}
        <CartBar currencySymbol={cs} onOpen={() => setCartOpen(true)} />
        <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} slug={params.slug} currencySymbol={cs} onOrderPlaced={handleOrderPlaced} />
        <ItemDetailSheet item={selectedItem} isOpen={!!selectedItem} onClose={() => setSelectedItem(null)} currencySymbol={cs} />
      </div>
    </div>
  );
}

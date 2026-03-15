'use client';

import { useRef, useEffect } from 'react';

interface CategoryTabsProps {
  categories: any[];
  activeId: string;
  onSelect: (id: string) => void;
}

export default function CategoryTabs({ categories, activeId, onSelect }: CategoryTabsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = document.getElementById(`cat-tab-${activeId}`);
    if (el && scrollRef.current) {
      el.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  }, [activeId]);

  return (
    <div className="sticky top-0 z-20 bg-[#0C0A08]/90 backdrop-blur-md border-b border-[#2E2924]/60">
      <div
        ref={scrollRef}
        className="flex gap-2 px-4 py-3 overflow-x-auto no-scrollbar"
        style={{ direction: 'rtl' }}
      >
        {categories.map((cat) => (
          <button
            key={cat._id}
            id={`cat-tab-${cat._id}`}
            onClick={() => onSelect(cat._id)}
            className={`
              flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm
              font-medium transition-all duration-200 whitespace-nowrap font-arabic
              ${activeId === cat._id
                ? 'bg-[var(--brand-color)] text-[#0C0A08] shadow-lg shadow-[var(--brand-color)]/20'
                : 'bg-[#1C1714] text-[#9B9189] border border-[#2E2924] hover:border-[var(--brand-color)]/40'
              }
            `}
          >
            <span>{cat.emoji}</span>
            <span>{cat.nameAr || cat.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

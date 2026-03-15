'use client';

import { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';
import { Clock } from 'lucide-react';

export default function TimeElapsed({ createdAt }: { createdAt: string | Date }) {
  const [label, setLabel] = useState('');

  useEffect(() => {
    const update = () => {
      setLabel(formatDistanceToNow(new Date(createdAt), { addSuffix: true, locale: ar }));
    };
    update();
    const interval = setInterval(update, 30_000);
    return () => clearInterval(interval);
  }, [createdAt]);

  return (
    <p className="text-[12px] font-medium text-[#aaa] flex items-center gap-1">
      <Clock size={11} />
      {label}
    </p>
  );
}

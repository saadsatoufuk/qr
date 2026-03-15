import { ADMIN_TEXT } from '@/lib/adminText';

export default function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { bg: string; text: string }> = {
    pending:   { bg: 'bg-yellow-500/10', text: 'text-yellow-400' },
    confirmed: { bg: 'bg-blue-500/10',   text: 'text-blue-400' },
    preparing: { bg: 'bg-orange-500/10', text: 'text-orange-400' },
    ready:     { bg: 'bg-green-500/10',  text: 'text-green-400' },
    completed: { bg: 'bg-gray-500/10',   text: 'text-gray-400' },
    cancelled: { bg: 'bg-red-500/10',    text: 'text-red-400' },
  };

  const c = config[status] || config.pending;
  const label = ADMIN_TEXT.orderStatus[status] || status;

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${c.bg} ${c.text}`}>
      {label}
    </span>
  );
}

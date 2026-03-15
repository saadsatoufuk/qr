import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  color?: string;
}

export default function StatsCard({ label, value, icon: Icon, color = 'text-white' }: StatsCardProps) {
  return (
    <div className="bg-admin-card border border-admin-border rounded-xl p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-gray-500 text-sm">{label}</span>
        <Icon size={20} strokeWidth={1.5} className={color} />
      </div>
      <p className={`text-2xl font-semibold ${color}`}>{value}</p>
    </div>
  );
}

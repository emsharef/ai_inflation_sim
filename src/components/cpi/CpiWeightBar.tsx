'use client';

interface CpiWeightBarProps {
  weight: number;
  maxWeight?: number;
  color?: string;
}

export default function CpiWeightBar({ weight, maxWeight = 45, color = '#3b82f6' }: CpiWeightBarProps) {
  const pct = Math.min((weight / maxWeight) * 100, 100);

  return (
    <div className="flex items-center gap-2">
      <div className="w-20 h-1.5 bg-[#1a1a24] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
      <span className="text-[10px] text-[#606070] tabular-nums w-10 text-right">
        {weight.toFixed(1)}%
      </span>
    </div>
  );
}

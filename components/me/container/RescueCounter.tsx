"use client";

import { useEffect, useState } from "react";

import { formatYen } from "@/lib/formatter";

import { Marker } from "@/components/common/Marker";

function RescueCounterChart({
  count,
  totalDiscount,
}: {
  count: number;
  totalDiscount: number;
}) {
  const [animatedCount, setAnimatedCount] = useState(0);

  useEffect(() => {
    const id = window.setTimeout(() => {
      setAnimatedCount(Math.min(count, 100));
    }, 30);
    return () => window.clearTimeout(id);
  }, [count]);

  return (
    <div className="flex items-center gap-4">
      <div
        className="relative h-24 w-24 rounded-full transition-all duration-700"
        style={{
          background: `conic-gradient(#16a34a ${animatedCount * 3.6}deg, #e5e7eb 0deg)`,
        }}
      >
        <div className="absolute inset-3 flex items-center justify-center rounded-full bg-white text-sm font-bold text-gray-800">
          {count}
        </div>
      </div>
      <div className="space-y-1">
        <p className="text-3xl font-bold text-gray-900">{count}</p>
        <p className="text-sm text-gray-600">救済カウンタ（購入報告数）</p>
        <p className="text-sm font-medium text-emerald-700">
          累計お得額: {formatYen(totalDiscount)}
        </p>
      </div>
    </div>
  );
}

interface RescueCounterProps {
  count: number;
  totalDiscount: number;
}

export function RescueCounter({ count, totalDiscount }: RescueCounterProps) {
  return (
    <div className="space-y-4 px-5">
      <h2 className="pl-2 text-lg font-semibold text-gray-800">
        <Marker color="var(--color-brand-accent-300)">救済カウンタ</Marker>
      </h2>
      <RescueCounterChart count={count} totalDiscount={totalDiscount} />
    </div>
  );
}

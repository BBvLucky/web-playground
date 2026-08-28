"use client";

import { memo } from "react";

import type { CryptoData } from "@/hooks/usePriceDataStream";

interface Props extends Pick<
  CryptoData,
  "price" | "priceChangePercent" | "priceChangeDirection" | "symbol"
> {
  name: string;
  icon: string;
  loading: boolean;
  error: string | null;
}

const ANIMATION_CLASS: Record<Props["priceChangeDirection"], string> = {
  "+": "animate-flash-up",
  "-": "animate-flash-down",
  "=": "",
};

function TokenCard({
  symbol,
  name,
  icon,
  loading,
  error,
  price,
  priceChangePercent,
  priceChangeDirection,
}: Props) {
  // Show loading state or error
  if (loading) {
    return (
      <div className="bg-bg-card border border-neutral-200 dark:border-neutral-800 p-5 rounded-xl shadow-sm flex flex-col gap-4 animate-shimmer">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center text-xl font-bold border border-neutral-200 dark:border-neutral-800"></div>
            <div>
              <h3 className="font-bold text-sm leading-none h-4 bg-gray-300 dark:bg-gray-700 rounded w-16"></h3>
              <span className="text-xs text-neutral-400 font-mono uppercase h-3 bg-gray-300 dark:bg-gray-700 rounded w-12 mt-1 block"></span>
            </div>
          </div>
        </div>
        <div>
          <span className="text-2xl font-black font-mono tracking-tight inline-block h-8 bg-gray-300 dark:bg-gray-700 rounded w-24"></span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-bg-card border border-neutral-200 dark:border-neutral-800 p-5 rounded-xl shadow-sm flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center text-xl font-bold border border-neutral-200 dark:border-neutral-800">
              {icon}
            </div>
            <div>
              <h3 className="font-bold text-sm leading-none">{name}</h3>
              <span className="text-xs text-neutral-400 font-mono uppercase">
                {symbol.replace("USDT", "")}
              </span>
            </div>
          </div>
        </div>
        <div>
          <span className="text-2xl font-black font-mono tracking-tight inline-block text-red-500">
            Error loading price
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-bg-card border border-neutral-200 dark:border-neutral-800 p-5 rounded-xl shadow-sm flex flex-col gap-4 transition-all hover:border-neutral-300 dark:hover:border-neutral-700">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center text-xl font-bold border border-neutral-200 dark:border-neutral-800">
            {icon}
          </div>
          <div>
            <h3 className="font-bold text-sm leading-none">{name}</h3>
            <span className="text-xs text-neutral-400 font-mono uppercase">
              {symbol.replace("USDT", "")}
            </span>
          </div>
        </div>
      </div>

      <div>
        <div className="font-black font-mono flex justify-between items-center">
          <span
            key={price}
            className={`text-2xl font-black font-mono tracking-tight inline-block ${ANIMATION_CLASS[priceChangeDirection]}`}
          >
            ${Number(price).toFixed(2)}
          </span>
          <span
            className={
              Number(priceChangePercent) > 0
                ? "text-(--up-green)"
                : "text-(--down-red)"
            }
          >
            {priceChangePercent}%
          </span>
        </div>
        <span className="text-[10px] text-neutral-400 block mt-0.5">
          в реальном времени
        </span>
      </div>
    </div>
  );
}

export default memo(TokenCard);

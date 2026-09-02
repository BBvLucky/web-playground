"use client";

import { memo, useCallback, useMemo } from "react";

import type { CryptoData } from "@/hooks/usePriceDataStream";
import { TickerWindows } from "@/types/binanceApiTypes";

interface Props extends Pick<
  CryptoData,
  "price" | "priceChangePercent" | "symbol"
> {
  name: string;
  icon: string;
  loading: boolean;
  error: string | null;
}

interface TickerWindowChangeButton {
  id: TickerWindows;
  label: string;
}

function TokenCard({
  symbol,
  name,
  icon,
  loading,
  error,
  price,
  priceChangePercent,
}: Props) {
  const isUp = useMemo(
    () => Number(priceChangePercent) > 0,
    [priceChangePercent],
  );
  const animationClass = useMemo(
    () => (isUp ? "animate-flash-up" : "animate-flash-down"),
    [isUp],
  );
  const textColor = useMemo(
    () => (isUp ? "text-(--up-green)" : "text-(--down-red)"),
    [isUp],
  );

  const buttons = useMemo<TickerWindowChangeButton[]>(
    () => [
      { id: TickerWindows["1h"], label: "1h" },
      { id: TickerWindows["4h"], label: "4h" },
      { id: TickerWindows["1d"], label: "1d" },
    ],
    [],
  );

  const isActive = false;

  const renderButtons = useCallback(
    () => (
      <div className="flex row-auto gap-1">
        {buttons.map((i) => (
          <button
            key={i.id}
            className={`
            px-1 flex items-center justify-center rounded-lg font-semibold text-xs transition-all duration-200 border
            active:scale-95
            disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none
            ${
              isActive
                ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                : "text-slate-400 hover:bg-slate-700 hover:text-slate-200"
            }
            `}
          >
            {i.label}
          </button>
        ))}
      </div>
    ),
    [buttons, isActive],
  );

  if (loading || !symbol || !name || !icon) {
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
            className={`text-2xl font-black font-mono tracking-tight inline-block ${animationClass}`}
          >
            ${Number(price).toFixed(2)}
          </span>
          <div className="flex row-auto justify-between gap-3 grow-0">
            {renderButtons()}
            <span className={textColor}>{priceChangePercent}%</span>
          </div>
        </div>
        <span className="text-[10px] text-neutral-400 block mt-0.5">
          в реальном времени
        </span>
      </div>
    </div>
  );
}

export default memo(TokenCard);

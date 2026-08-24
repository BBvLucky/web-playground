"use client";

import { usePriceDataStream } from "@/hooks/usePriceDataStream";

interface Props {
  symbol: string;
  name: string;
  icon: string;
}

export default function TokenCard({ symbol, name, icon }: Props) {
  const { price, isUp } = usePriceDataStream(symbol);

  const setClass = () => {
    switch (isUp) {
      case "+":
        return "animate-flash-up";
      case "-":
        return "animate-flash-down";
      case "=":
        return "";
    }
  };

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
        <span
          className={`text-2xl font-black font-mono tracking-tight inline-block ${setClass()}`}
        >
          ${price}
        </span>
        <span className="text-[10px] text-neutral-400 block mt-0.5">
          в реальном времени
        </span>
      </div>
    </div>
  );
}

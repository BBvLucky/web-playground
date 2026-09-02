"use client";

import { useCallback } from "react";

import TokenCard from "@/components/TokenCard";
import { usePriceDataStream } from "@/hooks/usePriceDataStream";
import { SupportedCoins } from "@/types/tokensEnum";

const COINS_LIST = [
  SupportedCoins.BTCUSDT,
  SupportedCoins.ETHUSDT,
  SupportedCoins.SOLUSDT,
  SupportedCoins.BNBUSDT,
  SupportedCoins.XRPUSDT,
  SupportedCoins.ADAUSDT,
  SupportedCoins.DOTUSDT,
  SupportedCoins.DOGEUSDT,
  SupportedCoins.AVAXUSDT,
];

const coins = [
  { symbol: SupportedCoins.BTCUSDT, name: "Bitcoin", icon: "₿" },
  { symbol: SupportedCoins.ETHUSDT, name: "Ethereum", icon: "Ξ" },
  { symbol: SupportedCoins.SOLUSDT, name: "Solana", icon: "☀️" },
  { symbol: SupportedCoins.BNBUSDT, name: "Binance Coin", icon: "BNB" },
  { symbol: SupportedCoins.XRPUSDT, name: "Ripple", icon: "✕" },
  { symbol: SupportedCoins.ADAUSDT, name: "Cardano", icon: "₳" },
  { symbol: SupportedCoins.DOTUSDT, name: "Polkadot", icon: "●" },
  { symbol: SupportedCoins.DOGEUSDT, name: "Dogecoin", icon: "Ð" },
  { symbol: SupportedCoins.AVAXUSDT, name: "Avalanche", icon: "A" },
];

function Home() {
  const { data, loading, error } = usePriceDataStream(COINS_LIST);

  const renderTokenCard = useCallback(
    () =>
      coins.map((i) => {
        const extractedData = data[i.symbol] || {};

        return (
          <TokenCard
            key={i.symbol}
            symbol={extractedData?.symbol}
            name={i.name}
            icon={i.icon}
            price={extractedData?.price}
            priceChangePercent={extractedData?.priceChangePercent}
            loading={loading}
            error={error}
          />
        );
      }),
    [data, error, loading],
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl md:text-2xl font-black tracking-tight">
          Обзор рынка
        </h1>
        <p className="text-xs md:text-sm text-neutral-400 mt-1">
          Следите за курсами ведущих криптовалют в реальном времени.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {renderTokenCard()}
      </div>
    </div>
  );
}

export default Home;

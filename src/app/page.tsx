import TokenCard from "@/components/TokenCard";

export default function Home() {
  // Define supported coins with their details
  const coins = [
    { symbol: "BTCUSDT", name: "Bitcoin", icon: "₿" },
    { symbol: "ETHUSDT", name: "Ethereum", icon: "Ξ" },
    { symbol: "SOLUSDT", name: "Solana", icon: "☀️" },
    { symbol: "BNBUSDT", name: "Binance Coin", icon: "BNB" },
    { symbol: "XRPUSDT", name: "Ripple", icon: "✕" },
    { symbol: "ADAUSDT", name: "Cardano", icon: "₳" },
    { symbol: "DOTUSDT", name: "Polkadot", icon: "●" },
    { symbol: "DOGEUSDT", name: "Dogecoin", icon: "Ð" },
    { symbol: "AVAXUSDT", name: "Avalanche", icon: "A" },
    { symbol: "MATICUSDT", name: "Polygon", icon: "M" },
  ];

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
        {coins.map((coin) => (
          <TokenCard 
            key={coin.symbol} 
            symbol={coin.symbol} 
            name={coin.name} 
            icon={coin.icon} 
          />
        ))}
      </div>
    </div>
  );
}

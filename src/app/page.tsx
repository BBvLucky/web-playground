import TokenCard from "@/components/TokenCard";

export default function Home() {
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
        <TokenCard symbol="BTCUSDT" name="Bitcoin" icon="₿" />
        <TokenCard symbol="ETHUSDT" name="Ethereum" icon="Ξ" />
        <TokenCard symbol="SOLUSDT" name="Solana" icon="☀️" />
      </div>
    </div>
  );
}

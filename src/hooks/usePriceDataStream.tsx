"use client"; // Хук работает строго в браузере с оконным окружением

import { useState, useEffect } from "react";

export interface CryptoData {
  price: string | null;
  isUp: "+" | "-" | "=";
}

const UPDATE_INTERVAL = 1000;

export function usePriceDataStream(symbol: string = "btcusdt") {
  const [data, setData] = useState<CryptoData>({
    price: "0.00",
    isUp: "=",
  });

  useEffect(() => {
    const wsUrl = `wss://stream.binance.com:9443/ws/${symbol.toLocaleLowerCase()}@aggTrade`;
    const ws = new WebSocket(wsUrl);

    let latestPrice: string | null = null;
    let timer: ReturnType<typeof setTimeout> | null = null;

    const flush = () => {
      timer = null;
      if (latestPrice === null) return;

      setData((prevData) => {
        const curr = Number(latestPrice);
        const prev = Number(prevData.price);
        return {
          price: latestPrice,
          isUp: curr > prev ? "+" : curr < prev ? "-" : "=",
        };
      });
      latestPrice = null;
    };

    ws.onmessage = (event) => {
      try {
        const response = JSON.parse(event.data);
        const currentPrice = Number.parseFloat(response.p).toFixed(2);

        if (!currentPrice) return;

        latestPrice = currentPrice;

        if (timer === null) {
          timer = setTimeout(flush, UPDATE_INTERVAL);
        }
      } catch (error) {
        console.error("WebSocket data parsing error:", error);
      }
    };

    ws.onerror = (error) => {
      console.error(`WebSocket for token ${symbol}:`, error);
    };

    return () => {
      if (timer !== null) clearTimeout(timer);
      if (
        ws.readyState === WebSocket.OPEN ||
        ws.readyState === WebSocket.CONNECTING
      ) {
        ws.close();
      }
    };
  }, [symbol]);

  return data;
}

"use client"; // Хук работает строго в браузере с оконным окружением

import { useEffect, useState } from "react";

export interface CryptoData {
  price: string;
  isUp: "+" | "-" | "=";
}

const UPDATE_INTERVAL = 1000; // мс
const MAX_RETRY_DELAY = 15000;

export function usePriceDataStream(symbol: string = "btcusdt") {
  const [data, setData] = useState<CryptoData>({
    price: "0.00",
    isUp: "=",
  });

  useEffect(() => {
    let disposed = false;
    let ws: WebSocket | null = null;
    let retry = 0;
    let latestPrice: string | null = null;
    let flushTimer: ReturnType<typeof setTimeout> | null = null;
    let reconnectTimer: ReturnType<typeof setTimeout> | null = null;

    const url = `wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@aggTrade`;

    const flush = () => {
      flushTimer = null;
      if (latestPrice === null || disposed) return;

      const nextPrice = latestPrice;
      latestPrice = null;

      setData((prev) => {
        const curr = Number(nextPrice);
        const prevPrice = Number(prev.price);
        return {
          price: nextPrice,
          isUp: curr > prevPrice ? "+" : curr < prevPrice ? "-" : "=",
        };
      });
    };

    const connect = () => {
      ws = new WebSocket(url);

      ws.onopen = () => {
        retry = 0;
      };

      ws.onmessage = (event) => {
        try {
          const response = JSON.parse(event.data);
          const raw = response?.p;

          if (raw === null || raw === undefined || raw === "") return;

          const parsed = Number.parseFloat(raw);
          if (!Number.isFinite(parsed)) return;

          latestPrice = parsed.toFixed(2);
          if (flushTimer === null) {
            flushTimer = setTimeout(flush, UPDATE_INTERVAL);
          }
        } catch (error) {
          console.error("WebSocket data parsing error:", error);
        }
      };

      ws.onerror = (error) => {
        console.error(`WebSocket error for ${symbol}:`, error);
      };

      ws.onclose = () => {
        if (flushTimer !== null) clearTimeout(flushTimer);
        flush(); // сливаем буфер, чтобы не потерять последнюю цену

        if (disposed) return;

        // экспоненциальный бэкофф: 1с, 2с, 4с... максимум 15с
        const delay = Math.min(1000 * 2 ** retry++, MAX_RETRY_DELAY);
        reconnectTimer = setTimeout(connect, delay);
      };
    };

    connect();

    return () => {
      disposed = true;
      if (flushTimer !== null) clearTimeout(flushTimer);
      if (reconnectTimer !== null) clearTimeout(reconnectTimer);
      if (
        ws &&
        (ws.readyState === WebSocket.OPEN ||
          ws.readyState === WebSocket.CONNECTING)
      ) {
        ws.close();
      }
    };
  }, [symbol]);

  return data;
}

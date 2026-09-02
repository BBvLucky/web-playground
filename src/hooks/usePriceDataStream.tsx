"use client";

import { useEffect, useState, useMemo } from "react";

import { ResponseDataType, TickerWindows } from "@/types/binanceApiTypes";

export interface CryptoData {
  symbol: string;
  price: string;
  priceChangePercent: string;
}

export interface PriceDataStreamState {
  data: Record<string, CryptoData>;
  loading: boolean;
  error: string | null;
}

const MAX_RETRY_DELAY = 15000;

export function usePriceDataStream(
  symbols: string[],
  window: keyof typeof TickerWindows = "1h",
) {
  const [state, setState] = useState<PriceDataStreamState>({
    data: {},
    loading: true,
    error: null,
  });

  const symbolsKey = useMemo(() => symbols.join(","), [symbols]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const symbolsSet = useMemo(() => new Set(symbols), [symbolsKey]);

  useEffect(() => {
    let disposed = false;
    let ws: WebSocket | null = null;
    let retry = 0;
    let reconnectTimer: ReturnType<typeof setTimeout> | null = null;

    const url = `wss://stream.binance.com:9443/stream`;

    const connect = () => {
      if (disposed) return;

      try {
        ws = new WebSocket(url);
      } catch (e) {
        setState((prev) => ({
          ...prev,
          error: `Failed to create WebSocket connection: ${e}`,
        }));
        return;
      }

      ws.onopen = () => {
        if (disposed) return;

        retry = 0;
        setState((prev) => ({ ...prev, error: null }));

        const subscribeMessage = {
          method: "SUBSCRIBE",
          params: [`!ticker_${window}@arr`],
          id: "1",
        };

        try {
          ws?.send(JSON.stringify(subscribeMessage));
        } catch (e) {
          setState((prev) => ({
            ...prev,
            error: `Failed to send subscription request: ${e}`,
          }));
        }
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);

          if (Array.isArray(data.data)) {
            data.data.forEach((ticker: ResponseDataType) => {
              if (ticker.s && typeof ticker.c === "string" && ticker.c !== "") {
                const symbol = ticker.s;
                const price = ticker.c;
                const priceChangePercent = ticker.P;

                if (symbolsSet.has(symbol)) {
                  setState((prev) => {
                    return {
                      ...prev,
                      data: {
                        ...prev.data,
                        [symbol]: {
                          symbol,
                          price,
                          priceChangePercent,
                        },
                      },
                      loading: false,
                    };
                  });
                }
              }
            });
          } else if (data.result === null && data.id) {
            setState((prev) => ({ ...prev, loading: false }));
          }
        } catch (e) {
          setState((prev) => ({
            ...prev,
            error: `Failed to parse data from Binance API: ${e}`,
          }));
        }
      };

      ws.onerror = () => {
        setState((prev) => ({
          ...prev,
          error: "WebSocket connection error occurred",
        }));
      };

      ws.onclose = () => {
        if (disposed) return;

        const delay = Math.min(1000 * 2 ** retry++, MAX_RETRY_DELAY);
        reconnectTimer = setTimeout(connect, delay);
      };
    };

    connect();

    return () => {
      disposed = true;
      if (reconnectTimer !== null) clearTimeout(reconnectTimer);
      if (
        ws &&
        (ws.readyState === WebSocket.OPEN ||
          ws.readyState === WebSocket.CONNECTING)
      ) {
        ws.close();
      }
    };
  }, [symbolsKey, symbolsSet, window]);

  return state;
}

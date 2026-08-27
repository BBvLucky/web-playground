"use client";

import { useEffect, useState, useCallback } from "react";

export interface CryptoData {
  symbol: string;
  price: string;
  isUp: "+" | "-" | "=";
  timestamp: number;
}

export interface PriceDataStreamState {
  data: Record<string, CryptoData>;
  loading: boolean;
  error: string | null;
}

const MAX_RETRY_DELAY = 15000;
const HEARTBEAT_INTERVAL = 30000;

// Available cryptocurrencies to track (you can extend this list)
export const SUPPORTED_COINS = [
  "BTCUSDT",
  "ETHUSDT",
  "SOLUSDT",
  "BNBUSDT",
  "XRPUSDT",
  "ADAUSDT",
  "DOTUSDT",
  "DOGEUSDT",
  "AVAXUSDT",
  "MATICUSDT",
];

export function usePriceDataStream(symbols: string[] = ["BTCUSDT", "ETHUSDT"]) {
  const [state, setState] = useState<PriceDataStreamState>({
    data: {},
    loading: true,
    error: null,
  });

  // Memoized update function without dependency on state.data to prevent infinite loops
  const updateData = useCallback(
    (symbol: string, price: string, isUp: "+" | "-" | "=") => {
      setState((prev) => {
        return {
          ...prev,
          data: {
            ...prev.data,
            [symbol]: {
              symbol,
              price,
              isUp,
              timestamp: Date.now(),
            },
          },
          loading: false,
        };
      });
    },
    [],
  );

  useEffect(() => {
    let disposed = false;
    let ws: WebSocket | null = null;
    let retry = 0;
    let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
    let heartbeatTimer: ReturnType<typeof setInterval> | null = null;

    // Create a single connection for multiple symbols using the 'combined' stream via request method
    const url = `wss://stream.binance.com:9443/stream`;

    const connect = () => {
      if (disposed) return;

      try {
        ws = new WebSocket(url);
      } catch (error) {
        console.log("Failed to create WebSocket:", error);
        setState((prev) => ({
          ...prev,
          error: "Failed to create WebSocket connection",
        }));
        return;
      }

      ws.onopen = () => {
        if (disposed) return;

        retry = 0;
        setState((prev) => ({ ...prev, error: null }));

        // Send SUBSCRIBE request with windowSize=1h
        const subscribeMessage = {
          method: "SUBSCRIBE",
          params: [`!ticker_1h@arr`],
          id: "1",
        };

        try {
          ws?.send(JSON.stringify(subscribeMessage));
        } catch (error) {
          console.log("Subscribe send error:", error);
          setState((prev) => ({
            ...prev,
            error: "Failed to send subscription request",
          }));
        }

        // Send heartbeat to keep connection alive
        if (heartbeatTimer) clearInterval(heartbeatTimer);
        heartbeatTimer = setInterval(() => {
          if (!disposed && ws && ws.readyState === WebSocket.OPEN) {
            try {
              // Send a ping message to keep the connection alive
              ws.send('{"ping":true}');
            } catch (error) {
              console.log("Heartbeat send error:", error);
            }
          }
        }, HEARTBEAT_INTERVAL);
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log("data in stream", data);

          // Handle ping response
          if (data.ping) return;

          // Process array of ticker data
          if (Array.isArray(data.data)) {
            data.data.forEach((ticker: any) => {
              if (ticker.s && ticker.c) {
                const symbol = ticker.s;
                const price = ticker.c;

                // Only process supported symbols
                if (symbols.includes(symbol)) {
                  // We need to access the latest state values inside this closure
                  // Use a separate function that gets current data from state
                  setState((prev) => {
                    const prevData = prev.data;
                    // For the first update, initialize with current price
                    if (!prevData[symbol]) {
                      updateData(symbol, price, "=");
                    } else {
                      const prevPrice = parseFloat(prevData[symbol].price);
                      const currPrice = parseFloat(price);
                      const isUp =
                        currPrice > prevPrice
                          ? "+"
                          : currPrice < prevPrice
                            ? "-"
                            : "=";
                      updateData(symbol, price, isUp);
                    }
                    return prev; // Return unchanged state to avoid infinite loop issues
                  });
                }
              }
            });
          }
          // Handle subscription confirmation response
          else if (data.result === null && data.id) {
            // Subscription confirmed, we can start processing data
            setState((prev) => ({ ...prev, loading: false }));
          }
        } catch (error) {
          console.log("WebSocket data parsing error:", error);
          setState((prev) => ({
            ...prev,
            error: "Failed to parse data from Binance API",
          }));
        }
      };

      ws.onerror = (event) => {
        // The 'error' parameter in WebSocket onerror is an Event object, not an error message
        console.log("WebSocket error occurred:", event);
        setState((prev) => ({
          ...prev,
          error: "WebSocket connection error occurred",
        }));
      };

      ws.onclose = () => {
        if (heartbeatTimer) clearInterval(heartbeatTimer);

        if (disposed) return;

        // Exponential backoff: 1s, 2s, 4s... max 15s
        const delay = Math.min(1000 * 2 ** retry++, MAX_RETRY_DELAY);
        console.log(`Reconnecting in ${delay}ms`);
        reconnectTimer = setTimeout(connect, delay);
      };
    };

    connect();

    return () => {
      disposed = true;
      if (reconnectTimer !== null) clearTimeout(reconnectTimer);
      if (heartbeatTimer !== null) clearInterval(heartbeatTimer);
      if (
        ws &&
        (ws.readyState === WebSocket.OPEN ||
          ws.readyState === WebSocket.CONNECTING)
      ) {
        ws.close();
      }
    };
  }, [symbols]); // Removed state.data and updateData from dependency array to prevent infinite loops

  return state;
}

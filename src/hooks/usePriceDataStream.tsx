"use client";

import { useEffect, useState, useMemo } from "react";

import { ResponseDataType, TickerWindows } from "@/types/binanceApiTypes";

export interface CryptoData {
  symbol: string;
  price: string;
  priceChangePercent: string;
}

export type ConnectionStatus = "connecting" | "connected" | "reconnecting";

export interface PriceDataStreamState {
  data: Record<string, CryptoData>;
  loading: boolean;
  error: string | null;
  connectionStatus: ConnectionStatus;
}

const MAX_RETRY_DELAY = 15_000;
const BASE_RETRY_DELAY = 1_000;
const HEARTBEAT_INTERVAL = 15_000;
const PONG_TIMEOUT = 5_000;

function backoffDelay(attempt: number): number {
  const exponential = BASE_RETRY_DELAY * 2 ** attempt;
  const jitter = Math.random() * BASE_RETRY_DELAY;
  return Math.min(exponential + jitter, MAX_RETRY_DELAY);
}

export function usePriceDataStream(
  symbols: string[],
  window: TickerWindows = "1h",
) {
  const [state, setState] = useState<PriceDataStreamState>({
    data: {},
    loading: true,
    error: null,
    connectionStatus: "connecting",
  });

  const symbolsKey = useMemo(() => symbols.join(","), [symbols]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const symbolsSet = useMemo(() => new Set(symbols), [symbolsKey]);

  useEffect(() => {
    setState({
      data: {},
      loading: true,
      error: null,
      connectionStatus: "connecting",
    });

    let disposed = false;
    let ws: WebSocket | null = null;
    let retry = 0;
    let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
    let heartbeatTimer: ReturnType<typeof setInterval> | null = null;
    let pongTimer: ReturnType<typeof setTimeout> | null = null;

    const url = "wss://stream.binance.com:9443/stream";

    const stopHeartbeat = () => {
      if (heartbeatTimer !== null) clearInterval(heartbeatTimer);
      heartbeatTimer = null;
      if (pongTimer !== null) clearTimeout(pongTimer);
      pongTimer = null;
    };

    const startHeartbeat = (socket: WebSocket) => {
      stopHeartbeat();
      heartbeatTimer = setInterval(() => {
        if (disposed || socket.readyState !== WebSocket.OPEN) return;
        try {
          socket.send("ping");
        } catch {
          return;
        }
        pongTimer = setTimeout(() => {
          console.warn("[ws] pong timeout — forcing close");
          socket.close();
        }, PONG_TIMEOUT);
      }, HEARTBEAT_INTERVAL);
    };

    const fetchSnapshot = async () => {
      const list = Array.from(symbolsSet);
      const params = new URLSearchParams({
        symbols: JSON.stringify(list),
        windowSize: window,
      });

      try {
        const res = await fetch(
          `https://api.binance.com/api/v3/ticker?${params}`,
        );
        if (!res.ok) return;

        const rows = (await res.json()) as Array<{
          s: string;
          c: string;
          P: string;
        }>;

        if (disposed) return;

        const patch: Record<string, CryptoData> = {};
        for (const row of rows) {
          if (symbolsSet.has(row.s)) {
            patch[row.s] = {
              symbol: row.s,
              price: row.c,
              priceChangePercent: row.P,
            };
          }
        }

        setState((prev) => ({
          ...prev,
          data: { ...prev.data, ...patch },
          loading: false,
        }));
      } catch {}
    };

    const scheduleReconnect = () => {
      if (disposed) return;
      setState((prev) => ({ ...prev, connectionStatus: "reconnecting" }));
      const delay = backoffDelay(retry++);
      reconnectTimer = setTimeout(connect, delay);
    };

    const connect = () => {
      if (disposed) return;

      let socket: WebSocket;
      try {
        socket = new WebSocket(url);
      } catch (e) {
        setState((prev) => ({
          ...prev,
          error: `Failed to create WebSocket connection: ${String(e)}`,
        }));
        scheduleReconnect();
        return;
      }

      ws = socket;

      socket.onopen = () => {
        if (disposed) return;

        retry = 0;
        setState((prev) => ({
          ...prev,
          error: null,
          connectionStatus: "connected",
        }));

        const subscribeMessage = {
          method: "SUBSCRIBE",
          params: [`!ticker_${window}@arr`],
          id: "1",
        };

        try {
          socket.send(JSON.stringify(subscribeMessage));
        } catch (e) {
          setState((prev) => ({
            ...prev,
            error: `Failed to send subscription request: ${String(e)}`,
          }));
          return;
        }

        startHeartbeat(socket);
        void fetchSnapshot();
      };

      socket.onmessage = (event) => {
        if (disposed) return;

        if (event.data === "pong") {
          if (pongTimer !== null) {
            clearTimeout(pongTimer);
            pongTimer = null;
          }
          return;
        }

        let data: unknown;
        try {
          data = JSON.parse(event.data);
        } catch {
          return;
        }

        const msg = data as {
          data?: ResponseDataType[];
          result?: unknown;
          id?: string;
        };

        if (Array.isArray(msg.data)) {
          msg.data.forEach((ticker) => {
            if (ticker.s && typeof ticker.c === "string" && ticker.c !== "") {
              if (symbolsSet.has(ticker.s)) {
                setState((prev) => ({
                  ...prev,
                  data: {
                    ...prev.data,
                    [ticker.s]: {
                      symbol: ticker.s,
                      price: ticker.c,
                      priceChangePercent: ticker.P ?? "0",
                    },
                  },
                  loading: false,
                }));
              }
            }
          });
        } else if (msg.result === null && msg.id) {
          setState((prev) => ({ ...prev, loading: false }));
        }
      };

      socket.onerror = () => {};

      socket.onclose = () => {
        stopHeartbeat();
        if (disposed) return;
        scheduleReconnect();
      };
    };

    connect();

    return () => {
      disposed = true;
      stopHeartbeat();
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

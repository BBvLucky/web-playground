export type ResponseDataType = {
  e: string; // Event type // "1hTicker";
  E: number; // Event time // 1672515782136;
  s: string; // Symbol // "BNBBTC";
  p: string; // Price change // "0.0015";
  P: string; // Price change percent // "250.00";
  o: string; // Open price // "0.0010";
  h: string; // High price // "0.0025";
  l: string; // Low price // "0.0010";
  c: string; // Last price // "0.0025";
  w: string; // Weighted average price // "0.0018";
  v: string; // Total traded base asset volume // "10000";
  q: string; // Total traded quote asset volume // "18";
  O: number; // Statistics open time // 0;
  C: number; // Statistics close time // 1675216573749;
  F: number; // First trade ID // 0;
  L: number; // Last trade Id // 18150;
  n: number; // Total number of trades // 18151;
};

export type BinanceCombinedStreamResponseType = {
  stream: string; // !ticker_1h@arr
  data: ResponseDataType[];
};

export enum TickerWindows {
  "1h" = "1h",
  "4h" = "4h",
  "1d" = "1d",
}

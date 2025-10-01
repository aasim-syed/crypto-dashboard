export type CoinRow = {
  id: string; name: string; symbol: string;
  price: number; volume: number; market_cap: number;
  market_cap_rank: number; pct_change_24h: number;
};

export type History = { coin_id: string; series: { ts: string; price: number }[] };

export type QAResponse = {
  answer: string; intent: string; coin_id?: string;
  extra?: any;
};

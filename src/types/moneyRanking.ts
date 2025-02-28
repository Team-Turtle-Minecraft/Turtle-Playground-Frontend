// types/moneyRanking.ts

export interface moneyRanker {
  playerName: string;
  money: number;
}

export interface MoneyRankingResponse {
  moneyRankers: moneyRanker[];
}

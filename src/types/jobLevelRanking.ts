// types/ranking.ts
export type JobType = "Combat" | "Living";
export type JobName =
  | "FISHERMAN"
  | "MINER"
  | "FARMER"
  | "COOK"
  | "BLACKSMITH"
  | "WARRIOR"
  | "MAGE"
  | "ARCHER"
  | "ROGUE";

export interface Ranker {
  playerName: string;
  level: number;
}

export interface LevelRankingResponse {
  jobName: string;
  rankers: Ranker[];
}

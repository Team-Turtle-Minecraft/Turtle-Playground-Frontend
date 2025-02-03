// types/collectionRanking.ts
export interface CollectionRanker {
  playerName: string;
  progress: number;
}

export interface CollectionRankingResponse {
  collectionRankers: CollectionRanker[];
}

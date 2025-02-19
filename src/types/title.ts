// types/title.ts

export type TitleKey =
  | "none"
  | "cave_diver"
  | "pirate_king"
  | "backroom"
  | "silent"
  | "bookworm"
  | "goddess"
  | "pervert"
  | "star"
  | "frozen_flowers"
  | "altar"
  | "new_year"
  | "giant_clam"
  | "high_mountain"
  | "gay"
  | "jump"
  | "insect"
  | "plop";

export const TITLE_MAPPING: Record<TitleKey, string> = {
  none: "없음",
  cave_diver: "데이브 더 다이버",
  pirate_king: "해적왕의 꿈",
  backroom: "백룸",
  silent: "침묵",
  bookworm: "책벌레",
  goddess: "여신",
  pervert: "변태",
  star: "⭐",
  frozen_flowers: "서리꽃",
  altar: "통찰력",
  new_year: "새해",
  giant_clam: "조개",
  high_mountain: "야호",
  gay: "Gay",
  jump: "점핑",
  insect: "벌레",
  plop: "퐁당",
};

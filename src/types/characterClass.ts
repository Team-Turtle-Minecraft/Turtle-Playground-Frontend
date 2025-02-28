// types/characterClass.ts

export type CharacterClassKey =
  | "HUMAN"
  | "WARRIOR"
  | "MAGE"
  | "ROGUE"
  | "ARCHER"
  | "ARTIFICER"
  | "BLOODMOON_VAMPIRE"
  | "PHOENIX_HUNTER"
  | "DEATH_KNIGHT"
  | "TERRAMANCER";

export const CHARACTER_CLASS_MAPPING: Record<CharacterClassKey, string> = {
  HUMAN: "인간",
  WARRIOR: "전사",
  MAGE: "마법사",
  ROGUE: "도적",
  ARCHER: "궁수",
  ARTIFICER: "땜장이",
  BLOODMOON_VAMPIRE: "뱀파이어",
  PHOENIX_HUNTER: "피닉스 헌터",
  DEATH_KNIGHT: "죽음의 기사",
  TERRAMANCER: "테라맨서",
};

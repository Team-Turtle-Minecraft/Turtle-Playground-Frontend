// types/characterClass.ts

export type CharacterClassKey =
  | "HUMAN"
  | "WARRIOR"
  | "MAGE"
  | "ROGUE"
  | "ARCHER";

export const CHARACTER_CLASS_MAPPING: Record<CharacterClassKey, string> = {
  HUMAN: "인간",
  WARRIOR: "전사",
  MAGE: "마법사",
  ROGUE: "도적",
  ARCHER: "궁수",
};

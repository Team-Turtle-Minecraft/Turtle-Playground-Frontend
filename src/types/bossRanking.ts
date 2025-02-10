// types/bossRanking.ts

export const BOSS_MAPPING: Record<string, string> = {
  "고대의 기계 에르지옥스": "ergeox",
  "심연의 기사": "abyssal_knight",
  "타락한 기사": "knight_fallen",
  "지루한 연금술사": "boring_alchemist",
  "시체의 군주": "corpse_lord",
  위더: "toro_wither",

  // 향후 추가될 보스 목록
  // "벌레의 군주 에스로드": "bug",
  // "광기어린 허수아비": "cizha_the_scarecrow",
  // "봉인이 덜된 디아블로": "ouldhanaMob",
  // "크리스탈 히드라 신티아": "sintiaMob",

  // "분노한 드루이드": "Elven_Druid",
  // 미노타우르스: "toro_minotaur",
  // 다이얼팽: "Direfang",
  // 칠면조: "turkeyboss",
  // 셀레니아: "hv_selenia",
  // 철갑드래곤: "xiddri",
};

export type BossClearType = "Solo" | "Party";

// 솔로 보스 클리어 정보
interface SoloBossClear {
  playerName: string;
  clearTime: number;
  clearDay: string;
}

// 솔로 보스 클리어 랭킹 정보
interface SoloBossClearRank extends SoloBossClear {
  rankPosition: number;
}

// 파티 보스 클리어 정보
interface PartyBossClear {
  partyName: string;
  partyMembers: string;
  clearTime: number;
  clearDay: string;
}

// 파티 보스 클리어 랭킹 정보
interface PartyBossClearRank extends PartyBossClear {
  rankPosition: number;
}

// API 응답 타입
export interface BossRankingResponse {
  bossName: string;
  firstBossClearUser?: SoloBossClear;
  soloClearTimeRankers?: SoloBossClearRank[];
  firstBossClearParty?: PartyBossClear;
  bossClearTimeRankerParties?: PartyBossClearRank[];
}

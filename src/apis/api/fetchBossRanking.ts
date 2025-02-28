// apis/api/fetchBossRanking.ts

import { BossClearType, BossRankingResponse } from "@/types/bossRanking";
import { refreshToken } from "./refreshToken";

interface BossRankingError {
  status: number;
  errorCode: string;
  message: string;
}

export const getBossRanking = async (
  bossClearType: BossClearType,
  bossName: string
): Promise<BossRankingResponse> => {
  const makeRequest = async (token: string) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/ranking/boss?bossClearType=${bossClearType}&bossName=${bossName}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const responseData = await response.json();

    // 기록이 없는 경우는 정상적인 상황으로 처리
    if (
      !response.ok &&
      responseData.errorCode !== "FirstSoloBossClearLogNotFoundError" &&
      responseData.errorCode !== "FirstPartyBossClearLogNotFoundError"
    ) {
      throw { status: response.status, ...responseData } as BossRankingError;
    }

    return responseData;
  };

  try {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) throw new Error("No access token");

    try {
      return await makeRequest(accessToken);
    } catch (error) {
      if ((error as BossRankingError).errorCode === "ExpiredAccessTokenError") {
        const newToken = await refreshToken();
        if (!newToken) throw new Error("Token refresh failed");
        return await makeRequest(newToken);
      }
      throw error;
    }
  } catch (error) {
    const err = error as BossRankingError;
    if (
      err.errorCode !== "FirstSoloBossClearLogNotFoundError" &&
      err.errorCode !== "FirstPartyBossClearLogNotFoundError"
    ) {
      console.error("보스 랭킹 조회 실패:", error);
    }
    throw error;
  }
};

// 시간 포맷팅 유틸리티 함수
export const formatClearTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
};

// 날짜 포맷팅 유틸리티 함수
export const formatClearDay = (dateString: string): string => {
  const date = new Date(dateString);
  return date
    .toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
    .replace(/\. /g, "-")
    .replace(".", "");
};

// 파티 멤버 분리 유틸리티 함수
export const parsePartyMembers = (partyMembers: string): string[] => {
  if (!partyMembers.includes(",")) return [partyMembers];
  return partyMembers
    .split(",")
    .slice(0, -1)
    .map((member) => member.trim());
};

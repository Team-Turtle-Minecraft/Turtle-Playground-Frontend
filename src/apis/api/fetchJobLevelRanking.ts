import {
  JobName,
  JobType,
  LevelRankingResponse,
} from "@/types/jobLevelRanking";
import { refreshToken } from "./refreshToken";

export const getLevelRanking = async (
  jobType: JobType,
  jobName: JobName
): Promise<LevelRankingResponse> => {
  const makeRequest = async (token: string) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/ranking/level?jobType=${jobType}&jobName=${jobName}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw { status: response.status, ...error };
    }

    return response.json();
  };

  try {
    let accessToken = localStorage.getItem("accessToken");
    if (!accessToken) throw new Error("No access token");

    try {
      return await makeRequest(accessToken);
    } catch (error: any) {
      if (error.errorCode === "ExpiredAccessTokenError") {
        const newToken = await refreshToken();
        if (!newToken) throw new Error("Token refresh failed");
        return await makeRequest(newToken);
      }
      throw error;
    }
  } catch (error) {
    console.error("레벨 랭킹 조회 실패:", error);
    throw error;
  }
};

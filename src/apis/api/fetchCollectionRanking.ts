// apis/api/fetchCollectionRanking.ts
import { CollectionRankingResponse } from "@/types/collectionRanking";
import { refreshToken } from "./refreshToken";

export const getCollectionRanking =
  async (): Promise<CollectionRankingResponse> => {
    const makeRequest = async (token: string) => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/ranking/collection`,
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

      return await response.json();
    };

    try {
      const accessToken = localStorage.getItem("accessToken");
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
      console.error("도감 랭킹 데이터 로딩 실패:", error);
      throw error;
    }
  };

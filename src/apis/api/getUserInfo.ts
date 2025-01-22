// apis/api/getUserInfo.ts
import { UserInfo } from "@/types/userInfo";
import { refreshToken } from "./refreshToken";

export const getUserInfo = async (): Promise<UserInfo> => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      throw new Error("토큰이 없습니다.");
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/user`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      const errorResult = await response.json();

      if (errorResult.errorCode === "ExpiredAccessTokenError") {
        const newAccessToken = await refreshToken();

        if (!newAccessToken) {
          window.location.href = "/auth";
          throw new Error("토큰 재발급 실패");
        }

        // 새 토큰으로 재시도
        const retryResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/user`,
          {
            headers: {
              Authorization: `Bearer ${newAccessToken}`,
            },
          }
        );

        if (!retryResponse.ok) {
          throw new Error("사용자 정보 조회 실패");
        }

        return retryResponse.json();
      }
    }

    return response.json();
  } catch (error) {
    console.error("사용자 정보 조회 중 오류:", error);
    if (error instanceof Error && error.message === "토큰이 없습니다.") {
      window.location.href = "/auth";
    }
    throw error;
  }
};

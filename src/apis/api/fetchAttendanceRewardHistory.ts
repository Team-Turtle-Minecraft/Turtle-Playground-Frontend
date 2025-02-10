import { AttendanceRewardHistory } from "@/types/attendanceRewardHistory";
import { refreshToken } from "./refreshToken";

// fetchAttendanceRewardHistory.ts
export const fetchAttendanceRewardHistory =
  async (): Promise<AttendanceRewardHistory> => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        throw new Error("accessToken이 없습니다.");
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/user/attendance-reward/history`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        if (data.errorCode === "ExpiredAccessTokenError") {
          const newAccessToken = await refreshToken();
          if (newAccessToken) {
            const retryResponse = await fetch(
              `${process.env.NEXT_PUBLIC_API_URL}/api/user/attendance-reward/history`,
              {
                headers: {
                  Authorization: `Bearer ${newAccessToken}`,
                },
              }
            );
            return retryResponse.json();
          }
        }
        throw new Error(data.message || "보상 기록 조회 실패");
      }

      return data;
    } catch (error) {
      console.error("보상 기록 조회 실패:", error);
      throw error;
    }
  };

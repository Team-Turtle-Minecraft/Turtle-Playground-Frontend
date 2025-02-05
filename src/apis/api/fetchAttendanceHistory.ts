import { AttendanceHistoryResponse } from "@/types/attendance";
import { refreshToken } from "./refreshToken";

export const fetchAttendanceHistory =
  async (): Promise<AttendanceHistoryResponse> => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        throw new Error("accessToken이 없습니다.");
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/user/attendance/history`,
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
              `${process.env.NEXT_PUBLIC_API_URL}/api/user/attendance/history`,
              {
                headers: {
                  Authorization: `Bearer ${newAccessToken}`,
                },
              }
            );
            return retryResponse.json();
          }
        }
        throw new Error(data.message || "출석 기록 조회 실패");
      }

      return data;
    } catch (error) {
      console.error("출석 기록 조회 중 오류:", error);
      throw error;
    }
  };

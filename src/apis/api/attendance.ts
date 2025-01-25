import { AttendanceResponse } from "@/types/attendance";
import { refreshToken } from "./refreshToken";

export const checkAttendance = async (): Promise<AttendanceResponse> => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      throw new Error("accessToken이 없습니다.");
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/user/attendance`,
      {
        method: "POST",
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
          // 새 토큰으로 재시도
          const retryResponse = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/user/attendance`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${newAccessToken}`,
              },
            }
          );

          return retryResponse.json();
        }
      }
      return data;
    }

    return data;
  } catch (error) {
    console.error("출석체크 중 오류 발생:", error);
    throw error;
  }
};

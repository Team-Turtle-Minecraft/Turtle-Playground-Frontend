import { refreshToken } from "./refreshToken";

export const claimAttendanceReward = async (
  type: "15days" | "allDays"
): Promise<void> => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      throw new Error("accessToken이 없습니다.");
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/user/attendance-reward/${type}`,
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
          const retryResponse = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/user/attendance-reward/${type}`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${newAccessToken}`,
              },
            }
          );

          if (!retryResponse.ok) {
            throw new Error("보상 수령 재시도 실패");
          }
        }
      } else {
        throw new Error(data.message || "보상 수령 실패");
      }
    }
  } catch (error) {
    console.error("보상 수령 실패:", error);
    throw error;
  }
};

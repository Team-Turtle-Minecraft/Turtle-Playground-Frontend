export const refreshToken = async (): Promise<string | null> => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");

    // 두 토큰 모두 필요
    if (!accessToken || !refreshToken) {
      window.location.href = "/auth";
      return null;
    }

    // 항상 두 토큰 모두 보냄
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/auth/refreshToken`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
          "Authorization-refresh": `Bearer ${refreshToken}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Token refresh failed:", data);
      // refreshToken이 만료된 경우에만 로그아웃 처리
      if (data.errorCode === "ExpiredRefreshTokenError") {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/auth";
      }
      return null;
    }

    // 새로운 accessToken만 업데이트
    if (data?.accessToken) {
      localStorage.setItem("accessToken", data.accessToken);
      return data.accessToken;
    }

    return null;
  } catch (error) {
    console.error("토큰 갱신 실패:", error);
    return null;
  }
};

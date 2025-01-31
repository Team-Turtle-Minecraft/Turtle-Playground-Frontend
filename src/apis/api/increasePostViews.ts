import { refreshToken } from "./refreshToken";

export const increasePostViews = async (postId: string): Promise<void> => {
  const makeRequest = async (token: string) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/posts/${postId}/views`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok && response.status !== 400) {
      const error = await response.json();
      throw { status: response.status, ...error };
    }
  };

  try {
    let accessToken = localStorage.getItem("accessToken");
    if (!accessToken) throw new Error("No access token");

    try {
      await makeRequest(accessToken);
    } catch (error: any) {
      if (error.errorCode === "ExpiredAccessTokenError") {
        const newToken = await refreshToken();
        if (!newToken) throw new Error("Token refresh failed");
        await makeRequest(newToken);
      }
    }
  } catch (error) {
    console.error("조회수 증가 실패:", error);
    throw error;
  }
};

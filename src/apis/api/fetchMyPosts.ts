import { refreshToken } from "./refreshToken";

export const fetchMyPosts = async (): Promise<PostsResponse> => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      throw new Error("accessToken이 없습니다.");
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/posts/my`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();

      if (errorData.errorCode === "ExpiredAccessTokenError") {
        const newAccessToken = await refreshToken();
        if (newAccessToken) {
          // 새 토큰으로 재시도
          const retryResponse = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/posts/my`,
            {
              headers: {
                Authorization: `Bearer ${newAccessToken}`,
              },
            }
          );

          if (!retryResponse.ok) {
            throw new Error("게시물 조회 재시도 실패");
          }

          return retryResponse.json();
        }
      }
      throw new Error(errorData.message || "게시물 조회 실패");
    }

    return response.json();
  } catch (error) {
    console.error("게시물 조회 중 오류 발생:", error);
    throw error;
  }
};

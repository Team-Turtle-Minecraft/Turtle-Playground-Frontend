import { PostLikeResponse } from "@/types/postDetail";
import { refreshToken } from "./refreshToken";

export const postLike = async (postId: number): Promise<PostLikeResponse> => {
  const makeRequest = async (token: string) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/posts/${postId}/like`,
      {
        method: "POST",
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
    console.error("좋아요 토글 실패:", error);
    throw error;
  }
};

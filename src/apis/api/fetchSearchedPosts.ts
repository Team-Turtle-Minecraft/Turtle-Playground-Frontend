import { refreshToken } from "./refreshToken";
import { PostResponse } from "@/types/postList";

interface SearchParams {
  keyword: string;
  page: number;
}

export const fetchSearchPosts = async ({
  keyword,
  page,
}: SearchParams): Promise<PostResponse> => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      window.location.href = "/auth";
      return Promise.reject("No access token");
    }

    const makeRequest = async (token: string) => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/posts/search?keyword=${encodeURIComponent(keyword)}&page=${page}`,
        {
          method: "GET",
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
      return await makeRequest(accessToken);
    } catch (error: any) {
      if (error.errorCode === "ExpiredAccessTokenError") {
        const newToken = await refreshToken();
        if (!newToken) return Promise.reject("Failed to refresh token");
        return await makeRequest(newToken);
      }
      throw error;
    }
  } catch (error) {
    console.error("검색 실패:", error);
    throw error;
  }
};

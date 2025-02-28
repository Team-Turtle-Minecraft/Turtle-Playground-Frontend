import { FetchPostsParams, PostResponse } from "@/types/postList";
import { refreshToken } from "./refreshToken";

export const fetchCommunityPosts = async ({
  sortType,
  postType,
  page = 1,
}: FetchPostsParams): Promise<PostResponse | null> => {
  try {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      window.location.href = "/auth";
      return null;
    }

    const queryParams = new URLSearchParams();
    if (sortType) queryParams.append("sortType", sortType);
    if (postType) queryParams.append("postType", postType);
    queryParams.append("page", String(page));

    const url = `${process.env.NEXT_PUBLIC_API_URL}/api/posts?${queryParams.toString()}`;

    const makeRequest = async (token: string) => {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });

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
        if (!newToken) return null;
        return await makeRequest(newToken);
      }
      throw error;
    }
  } catch (error) {
    console.error("게시물 목록 조회 실패:", error);
    return null;
  }
};

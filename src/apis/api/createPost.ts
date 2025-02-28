// apis/api/createPost.ts
import { refreshToken } from "./refreshToken";

export const createPost = async (formData: FormData): Promise<void> => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      window.location.href = "/auth";
      return;
    }

    const makeRequest = async (token: string) => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/posts/save`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
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
        if (!newToken) return;
        return await makeRequest(newToken);
      }
      throw error;
    }
  } catch (error) {
    console.error("게시물 작성 실패:", error);
    throw error;
  }
};

import { PostType } from "@/types/postList";
import { refreshToken } from "./refreshToken";

interface UpdatePostResponse {
  message: string;
  postId: number;
  creator: string;
  postType: PostType;
  title: string;
  content: string;
  updatedAt: string;
}

export const updatePost = async (
  postId: number,
  formData: FormData
): Promise<UpdatePostResponse> => {
  const makeRequest = async (token: string) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/posts/${postId}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          // Content-Type 헤더를 제거 - FormData를 사용할 때는 브라우저가 자동으로 설정
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
    console.error("게시물 수정 실패:", error);
    throw error;
  }
};

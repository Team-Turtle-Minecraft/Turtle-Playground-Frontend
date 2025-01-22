// apis/api/login.ts
import type { LoginResponse, SnsType } from "@/types/auth";

export const login = async (
  snsType: SnsType,
  accessToken: string
): Promise<LoginResponse> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          snsType,
          accessToken,
        }),
      }
    );

    // 404나 다른 에러 응답 처리
    if (response.status === 404) {
      throw new Error("UserNotFoundError");
    }

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "로그인에 실패했습니다.");
    }

    const responseData: LoginResponse = await response.json();

    if (responseData.token?.accessToken && responseData.token?.refreshToken) {
      console.log("Storing tokens:", {
        accessToken: responseData.token.accessToken,
        refreshToken: responseData.token.refreshToken,
      });

      localStorage.setItem("accessToken", responseData.token.accessToken);
      localStorage.setItem("refreshToken", responseData.token.refreshToken);
    } else {
      console.error("Token data missing from response:", responseData);
      throw new Error("토큰 데이터가 없습니다.");
    }

    return responseData;
  } catch (error) {
    if (error instanceof Error && error.message === "UserNotFoundError") {
      throw error; // UserNotFoundError는 그대로 전파
    }
    console.error("Login error:", error);
    throw new Error("로그인 처리 중 오류가 발생했습니다.");
  }
};

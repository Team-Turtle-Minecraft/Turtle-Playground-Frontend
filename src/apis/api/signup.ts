// apis/api/signup.ts
import { SignupData, SignupResponse } from "@/types/auth";

export const signup = async (
  signupData: SignupData
): Promise<SignupResponse> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/auth/signup`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          snsType: signupData.snsType,
          accessToken: signupData.accessToken,
          nickname: signupData.nickname,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "회원가입에 실패했습니다.");
    }

    const responseData: SignupResponse = await response.json();

    // token 객체 내부의 토큰들을 가져옴
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
    console.error("Signup function error:", error);
    throw error;
  }
};

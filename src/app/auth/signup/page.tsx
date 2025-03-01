"use client";

import { useEffect, useState } from "react";
import type { SnsType } from "@/types/auth";
import { checkNicknameDuplicate } from "@/apis/api/checkNickname";
import {
  AlreadyExistNicknameError,
  UserNotFoundErrorInTurtlePlayGround,
} from "@/apis/utility/errors";
import { signup } from "@/apis/api/signup";

export default function AdditionalInfoPage() {
  const [nickname, setNickname] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isNicknameChecked, setIsNicknameChecked] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [snsType, setSnsType] = useState<SnsType | null>(null);

  useEffect(() => {
    const storedToken = sessionStorage.getItem("oauth_access_token");
    const storedProvider = sessionStorage.getItem("oauth_provider");

    if (!storedToken || !storedProvider) {
      console.log("세션 스토리지 데이터 없음");
      alert("잘못된 접근입니다.");
      window.location.href = "/signup";
      return;
    }

    setAccessToken(storedToken);
    setSnsType(storedProvider as SnsType);

    // 데이터 사용 후 세션 스토리지에서 삭제
    sessionStorage.removeItem("oauth_access_token");
    sessionStorage.removeItem("oauth_provider");
  }, []);

  const handleNicknameCheck = async () => {
    if (!nickname) {
      alert("닉네임을 입력해주세요.");
      return;
    }

    try {
      await checkNicknameDuplicate(nickname);
      setIsNicknameChecked(true);
      alert("사용 가능한 닉네임입니다.");
    } catch (error) {
      if (
        error instanceof UserNotFoundErrorInTurtlePlayGround ||
        error instanceof AlreadyExistNicknameError
      ) {
        alert(error.message);
      } else {
        console.error("닉네임 중복 확인 실패:", error);
        alert("닉네임 중복 확인 중 오류가 발생했습니다.");
      }
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nickname || !accessToken || !snsType || !isNicknameChecked) {
      alert("닉네임 중복 확인을 먼저 진행해주세요.");
      return;
    }

    setIsLoading(true);
    try {
      console.log("Signup request data:", {
        snsType,
        accessToken,
        nickname,
      });

      const response = await signup({
        snsType,
        accessToken,
        nickname,
      });

      console.log("Signup response:", response);

      // response.token으로 접근하도록 수정
      if (response.token?.accessToken && response.token?.refreshToken) {
        console.log("Tokens before storing:", {
          accessToken: response.token.accessToken,
          refreshToken: response.token.refreshToken,
        });

        // 토큰 저장
        localStorage.setItem("accessToken", response.token.accessToken);
        localStorage.setItem("refreshToken", response.token.refreshToken);

        const storedAccessToken = localStorage.getItem("accessToken");
        const storedRefreshToken = localStorage.getItem("refreshToken");

        console.log("Stored tokens:", {
          accessToken: storedAccessToken,
          refreshToken: storedRefreshToken,
        });

        if (!storedAccessToken || !storedRefreshToken) {
          throw new Error("토큰 저장에 실패했습니다.");
        }
      } else {
        console.error("Invalid response format:", response);
        throw new Error("서버 응답에 토큰이 없습니다.");
      }

      alert("회원가입이 완료되었습니다.");

      console.log("Final token check:", {
        accessToken: localStorage.getItem("accessToken"),
        refreshToken: localStorage.getItem("refreshToken"),
      });

      window.location.href = "/";
    } catch (error) {
      console.error("회원가입 실패:", error);
      alert("회원가입에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-center text-gray-900">
            추가 정보 입력
          </h1>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="거북이 놀이터에서의 닉네임을 입력해주세요"
              value={nickname}
              onChange={(e) => {
                setNickname(e.target.value);
                setIsNicknameChecked(false);
              }}
              required
              minLength={2}
              maxLength={20}
              className="flex-1 px-4 py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              type="button"
              onClick={handleNicknameCheck}
              className="px-4 py-3 text-white bg-gray-400 rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              중복확인
            </button>
          </div>

          <button
            type="submit"
            disabled={isLoading || !isNicknameChecked}
            className="w-full px-4 py-3 font-medium text-white bg-green-600 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "처리중..." : "회원가입 완료"}
          </button>
        </form>
      </div>
    </div>
  );
}

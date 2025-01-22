"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import type { SnsType } from "@/types/auth";
import { login } from "@/apis/api/login";

const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
const KAKAO_TOKEN_URL = "https://kauth.kakao.com/oauth/token";

export default function OAuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const getAccessToken = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get("code");
        const state = urlParams.get("state");

        // provider 결정
        let provider: SnsType = "Google";
        if (state?.startsWith("KAKAO")) {
          provider = "Kakao";
        }

        if (!code) {
          throw new Error("인증 코드가 없습니다.");
        }

        let accessToken;

        // 소셜 로그인 제공자별 토큰 요청
        switch (provider) {
          case "Google": {
            const response = await fetch(GOOGLE_TOKEN_URL, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                code,
                client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
                client_secret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET,
                redirect_uri: process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI,
                grant_type: "authorization_code",
              }),
            });

            if (!response.ok) {
              console.error("Google token error:", await response.json());
              throw new Error("Google 토큰 발급에 실패했습니다.");
            }

            const data = await response.json();
            console.log("Google token response:", data);
            accessToken = data.access_token;
            break;
          }
          case "Kakao": {
            const response = await fetch(KAKAO_TOKEN_URL, {
              method: "POST",
              headers: {
                "Content-Type":
                  "application/x-www-form-urlencoded;charset=utf-8",
              },
              body: new URLSearchParams({
                grant_type: "authorization_code",
                client_id: process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID!,
                client_secret: process.env.NEXT_PUBLIC_KAKAO_CLIENT_SECRET!,
                redirect_uri: process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI!,
                code,
              }),
            });

            if (!response.ok) {
              console.error("Kakao token error:", await response.json());
              throw new Error("Kakao 토큰 발급에 실패했습니다.");
            }

            const data = await response.json();
            console.log("Kakao token response:", data);
            accessToken = data.access_token;
            break;
          }
        }

        if (!accessToken) {
          throw new Error("액세스 토큰을 받아오지 못했습니다.");
        }

        console.log("Received access token:", accessToken);
        console.log("Provider:", provider);

        try {
          // 로그인 시도
          const responseData = await login(provider, accessToken);
          console.log("Login response:", responseData);

          // 이미 가입된 회원인 경우 로그인 처리
          localStorage.setItem("accessToken", responseData.token.accessToken);
          localStorage.setItem("refreshToken", responseData.token.refreshToken);

          window.location.href = "/"; // 메인 페이지로 이동
        } catch (error: any) {
          console.log("Login attempt error:", error);

          if (error.message === "UserNotFoundError") {
            console.log("New user detected, proceeding to signup...");
            // 미가입 회원인 경우 회원가입 페이지로 이동
            sessionStorage.removeItem("oauth_access_token");
            sessionStorage.removeItem("oauth_provider");
            sessionStorage.setItem("oauth_access_token", accessToken);
            sessionStorage.setItem("oauth_provider", provider);

            console.log("Session storage set:", {
              accessToken: sessionStorage.getItem("oauth_access_token"),
              provider: sessionStorage.getItem("oauth_provider"),
            });

            // 페이지 이동 전 잠시 대기
            await new Promise((resolve) => setTimeout(resolve, 100));
            window.location.href = "/auth/signup";
          } else {
            throw error;
          }
        }
      } catch (error) {
        alert("로그인에 실패했습니다.");
        window.location.href = "/auth";
      }
    };

    getAccessToken();
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h2 className="text-xl">로그인 처리중...</h2>
        <p className="mt-2 text-gray-500">잠시만 기다려주세요.</p>
      </div>
    </div>
  );
}

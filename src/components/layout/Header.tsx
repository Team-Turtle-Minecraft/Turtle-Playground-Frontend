"use client";

import { useRef, useState, useEffect } from "react";
import { getUserInfo } from "@/apis/api/getUserInfo";
import { logout } from "@/apis/api/logout";
import { UserInfo } from "@/types/userInfo";
import { refreshToken } from "@/apis/api/refreshToken";

export default function Header() {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) {
        throw new Error("로그아웃 토큰이 없습니다.");
      }

      await logout(refreshToken);

      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      window.location.href = "/";
    } catch (error) {
      console.error("로그아웃 실패:", error);
      alert("로그아웃에 실패했습니다.");
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        if (accessToken) {
          try {
            const info = await getUserInfo();
            setUserInfo(info);
          } catch (error: any) {
            console.error("사용자 정보 로드 실패:", error);

            // error.response?.data 대신 error를 직접 확인
            if (error.errorCode === "ExpiredAccessTokenError") {
              try {
                // 토큰 재발급 시도
                const newAccessToken = await refreshToken();
                if (newAccessToken) {
                  // 새 토큰으로 사용자 정보 다시 조회
                  const retryInfo = await getUserInfo();
                  setUserInfo(retryInfo);
                }
              } catch (refreshError: any) {
                console.error("토큰 재발급 실패:", refreshError);
                // ExpiredRefreshTokenError인 경우에만 토큰 삭제
                if (refreshError.errorCode === "ExpiredRefreshTokenError") {
                  localStorage.removeItem("accessToken");
                  localStorage.removeItem("refreshToken");
                  window.location.href = "/auth";
                }
              }
            }
          }
        }
      } catch (error) {
        console.error("인증 확인 실패:", error);
      }
    };

    checkAuth();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="flex items-center justify-center px-6 py-4 bg-white">
      <div className="flex items-center justify-between w-full max-w-7xl">
        <div className="w-[200px]"></div>

        <div className="flex items-center space-x-12">
          <div
            className="flex flex-col items-center cursor-pointer"
            onClick={() => (window.location.href = "/")}
          >
            <img
              src="/assets/turtle-playground-logo.png"
              alt="거북이 놀이터"
              className="w-[98px] h-[68px] object-contain"
            />
            <span className="text-[20px] mt-1">거북이 놀이터</span>
          </div>

          <a href="/community" className="text-[22px]">
            커뮤니티
          </a>
          <a href="/ranking" className="text-[22px]">
            랭킹
          </a>
          <a href="/my/attendance" className="text-[22px]">
            출석체크
          </a>
        </div>

        <div className="w-[200px] flex justify-end">
          {userInfo ? (
            <div
              ref={dropdownRef}
              className="relative w-24 h-24" // 컨테이너 크기 고정
              onMouseEnter={() => setShowDropdown(true)}
              onMouseLeave={() => setShowDropdown(false)}
            >
              {/* 프로필 이미지와 닉네임을 포함하는 컨테이너 */}
              <div className="flex flex-col items-center justify-center w-full h-full cursor-pointer">
                <img
                  src={`https://api.creepernation.net/avatar/${userInfo.nickname}`}
                  alt="프로필"
                  className="w-[53px] h-[53.33px] rounded"
                />
                <span className="text-[15px] mt-1">{userInfo.nickname}</span>
              </div>

              {/* 드롭다운 메뉴 */}
              {showDropdown && (
                <div className="absolute right-0 z-50 w-32 py-2 bg-white rounded-lg shadow-lg top-24">
                  <button
                    onClick={() => (window.location.href = "/my/basic")}
                    className="w-full px-4 py-2 text-left hover:bg-gray-100"
                  >
                    내정보 조회
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 text-left text-red-500 hover:bg-gray-100"
                  >
                    로그아웃
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <button
                onClick={() => (window.location.href = "/auth")}
                className="px-4 py-2 text-gray-700 transition-colors bg-gray-100 rounded hover:bg-gray-200"
              >
                로그인
              </button>
              <button
                onClick={() => (window.location.href = "/auth")}
                className="px-4 py-2 ml-2 text-white transition-colors bg-gray-800 rounded hover:bg-gray-700"
              >
                회원가입
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

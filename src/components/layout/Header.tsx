"use client";

import { useRef, useState, useEffect } from "react";
import { getUserInfo } from "@/apis/api/getUserInfo";
import { logout } from "@/apis/api/logout";
import { UserInfo } from "@/types/userInfo";
import { refreshToken } from "@/apis/api/refreshToken";

export default function Header() {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

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

            if (error.errorCode === "ExpiredAccessTokenError") {
              try {
                const newAccessToken = await refreshToken();
                if (newAccessToken) {
                  const retryInfo = await getUserInfo();
                  setUserInfo(retryInfo);
                }
              } catch (refreshError: any) {
                console.error("토큰 재발급 실패:", refreshError);
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
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node)
      ) {
        setShowMobileMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const NavigationLinks = () => (
    <>
      <a href="/community" className="text-xl hover:text-gray-600">
        커뮤니티
      </a>
      <a href="/ranking/level" className="text-xl hover:text-gray-600">
        랭킹
      </a>
      <a href="/my/attendance" className="text-xl hover:text-gray-600">
        출석체크
      </a>
    </>
  );

  const AuthButtons = () => (
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
  );

  return (
    <nav className="bg-white">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Desktop View */}
        <div className="items-center justify-between hidden h-24 lg:flex">
          <div className="w-[200px]" /> {/* 좌측 여백 유지 */}
          <div className="flex items-center space-x-12">
            <div
              className="flex flex-col items-center cursor-pointer"
              onClick={() => (window.location.href = "/")}
            >
              <img
                src={`${process.env.ASSET_PREFIX}/front/assets/turtle-playground-logo.png`}
                alt="거북이 놀이터"
                className="w-[98px] h-[68px] object-contain"
              />
              <span className="mt-0 text-20px">거북이 놀이터</span>
            </div>

            <a href="/community" className="text-[22px] hover:text-gray-600">
              커뮤니티
            </a>
            <a
              href="/ranking/level"
              className="text-[22px] hover:text-gray-600"
            >
              랭킹
            </a>
            <a
              href="/my/attendance"
              className="text-[22px] hover:text-gray-600"
            >
              출석체크
            </a>
          </div>
          <div className="w-[200px] flex justify-end">
            {userInfo ? (
              <div
                ref={dropdownRef}
                className="relative w-24 h-24"
                onMouseEnter={() => setShowDropdown(true)}
                onMouseLeave={() => setShowDropdown(false)}
              >
                <div className="flex flex-col items-center justify-center w-full h-full cursor-pointer">
                  <img
                    src={`https://api.creepernation.net/avatar/${userInfo.nickname}`}
                    alt="프로필"
                    className="w-[53px] h-[53.33px] rounded"
                  />
                  <span className="text-[15px] mt-1">{userInfo.nickname}</span>
                </div>

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
              <div>
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
              </div>
            )}
          </div>
        </div>

        {/* Mobile View */}
        <div className="flex items-center justify-between h-20 lg:hidden">
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="p-2 text-gray-700 rounded hover:bg-gray-100"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
          {/* 모바일 로고 */}
          <div
            className="flex flex-col items-center cursor-pointer"
            onClick={() => (window.location.href = "/")}
          >
            <img
              src="/assets/turtle-playground-logo.png"
              alt="거북이 놀이터"
              className="w-[78px] h-[54px] object-contain"
            />
            <span className="text-base">거북이 놀이터</span>
          </div>
          {/* 모바일 프로필/로그인 */}
          <div className="w-[24px]" /> {/* 우측 여백 맞추기 */}
        </div>

        {/* 모바일 메뉴 */}
        {showMobileMenu && (
          <div ref={mobileMenuRef} className="lg:hidden">
            <div className="px-4 py-2 space-y-3 bg-white shadow-lg">
              <a href="/community" className="block py-2 text-lg">
                커뮤니티
              </a>
              <a href="/ranking/level" className="block py-2 text-lg">
                랭킹
              </a>
              <a href="/my/attendance" className="block py-2 text-lg">
                출석체크
              </a>
              <div className="pt-3 border-t">
                {userInfo ? (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3">
                      <img
                        src={`https://api.creepernation.net/avatar/${userInfo.nickname}`}
                        alt="프로필"
                        className="w-10 h-10 rounded"
                      />
                      <span>{userInfo.nickname}</span>
                    </div>
                    <button
                      onClick={() => (window.location.href = "/my/basic")}
                      className="block w-full py-2 text-left"
                    >
                      내정보 조회
                    </button>
                    <button
                      onClick={handleLogout}
                      className="block w-full py-2 text-left text-red-500"
                    >
                      로그아웃
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col space-y-2">
                    <button
                      onClick={() => (window.location.href = "/auth")}
                      className="w-full px-4 py-2 text-center text-gray-700 bg-gray-100 rounded hover:bg-gray-200"
                    >
                      로그인
                    </button>
                    <button
                      onClick={() => (window.location.href = "/auth")}
                      className="w-full px-4 py-2 text-center text-white bg-gray-800 rounded hover:bg-gray-700"
                    >
                      회원가입
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

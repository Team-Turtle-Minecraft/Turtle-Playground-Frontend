"use client";

import { logout } from "@/apis/api/logout";

export default function DashboardHeader() {
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

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white">
      {/* 좌측: 홈 버튼과 텍스트 */}
      <div className="flex items-center space-x-2">
        <a href="/" className="text-2xl">
          🏠
        </a>
        <a href="/" className="text-[15px]">
          거북이 놀이터
        </a>
      </div>

      {/* 중앙: 로고 */}
      <div className="flex flex-col items-center">
        <img
          src="/assets/turtle-playground-logo.png"
          alt="거북이 놀이터"
          className="w-[98px] h-[68px] object-contain"
        />
        <span className="text-[20px] mt-1">거북이 놀이터</span>
      </div>

      {/* 우측: 로그아웃 버튼 */}
      <button
        onClick={handleLogout}
        className="px-4 py-2 text-white bg-gray-800 rounded hover:bg-gray-700"
      >
        로그아웃
      </button>
    </header>
  );
}

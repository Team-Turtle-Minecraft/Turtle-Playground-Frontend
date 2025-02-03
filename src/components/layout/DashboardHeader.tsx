"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { logout } from "@/apis/api/logout";
import Modal from "../common/Modal";

export default function DashboardHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const handleLogout = async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) {
        throw new Error("로그아웃 토큰이 없습니다.");
      }

      await logout(refreshToken);
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");

      // 로그아웃 성공 모달 표시
      setIsLogoutModalOpen(true);

      // 모달이 잠시 표시된 후 메인 페이지로 이동
      setTimeout(() => {
        window.location.href = "/";
      }, 1500); // 1.5초 후 이동
    } catch (error) {
      console.error("로그아웃 실패:", error);
      alert("로그아웃에 실패했습니다.");
    }
  };

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white">
      {/* 좌측: 햄버거 메뉴와 홈 버튼 */}
      <div className="flex items-center space-x-1">
        <div
          className="relative w-8 h-8 cursor-pointer"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <Image
            src="/assets/hamburger-menu.png"
            alt="메뉴바"
            fill
            className="object-contain"
          />
        </div>
        <Link href="/" className="relative w-8 h-8 -ml-1">
          <Image
            src="/assets/homeButton.png"
            alt="홈"
            fill
            className="object-contain"
          />
        </Link>
      </div>

      {/* 햄버거 메뉴 드롭다운 */}
      {isMenuOpen && (
        <div className="absolute left-0 z-50 w-48 py-2 bg-white rounded-md shadow-lg top-16">
          <Link
            href="/community"
            className="block px-4 py-2 hover:bg-gray-100"
            onClick={() => setIsMenuOpen(false)}
          >
            커뮤니티
          </Link>
          <Link
            href="/ranking/level"
            className="block px-4 py-2 hover:bg-gray-100"
            onClick={() => setIsMenuOpen(false)}
          >
            랭킹
          </Link>
        </div>
      )}

      {/* 중앙: 로고 */}
      <div
        className="flex flex-col items-center cursor-pointer"
        onClick={() => (window.location.href = "/")}
      >
        <div className="w-[98px] h-[68px] relative">
          <Image
            src="/assets/turtle-playground-logo.png"
            alt="거북이 놀이터"
            fill
            className="object-contain"
          />
        </div>
        <span className="text-[20px] mt-1">거북이 놀이터</span>
      </div>

      {/* 우측: 로그아웃 버튼 */}
      <button
        onClick={handleLogout}
        className="px-4 py-2 text-white bg-gray-800 rounded hover:bg-gray-700"
      >
        로그아웃
      </button>

      {/* 로그아웃 완료 모달 */}
      <Modal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        message="로그아웃 되었습니다."
      />
    </header>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { logout } from "@/apis/api/logout";
import Modal from "../common/Modal";

export default function DashboardHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const sideMenuRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      sideMenuRef.current &&
      !sideMenuRef.current.contains(event.target as Node)
    ) {
      setIsMenuOpen(false);
      setActiveCategory(null);
    }
  };

  useEffect(() => {
    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  const handleLogout = async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) {
        throw new Error("로그아웃 토큰이 없습니다.");
      }

      await logout(refreshToken);
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");

      setIsLogoutModalOpen(true);
      setTimeout(() => {
        window.location.href = "/";
      }, 1500);
    } catch (error) {
      console.error("로그아웃 실패:", error);
      alert("로그아웃에 실패했습니다.");
    }
  };

  const communitySubMenu = [
    { name: "자유", link: "/community?postType=Free" },
    { name: "건축", link: "/community?postType=Architecture" },
    { name: "아이템", link: "/community?postType=Item" },
    { name: "공략", link: "/community?postType=Solution" },
    { name: "팁", link: "/community?postType=Tip" },
  ];

  const rankingSubMenu = [
    { name: "레벨", link: "/ranking/level" },
    { name: "게시물", link: "/ranking/post" },
    { name: "보스", link: "/ranking/boss" },
    { name: "돈", link: "/ranking/money" },
    { name: "도감", link: "/ranking/collection" },
  ];

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

      {/* 사이드 메뉴 */}
      <div
        ref={sideMenuRef}
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-white shadow-xl transform transition-transform duration-300 ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6">
          <div className="mb-8 text-xl font-bold">거북이 놀이터</div>
          <div className="space-y-6">
            {/* 커뮤니티 섹션 */}
            <div>
              <div
                className="flex items-center justify-between py-2 cursor-pointer hover:text-blue-600"
                onClick={() => {
                  if (activeCategory === "community") {
                    window.location.href = "/community";
                  } else {
                    setActiveCategory(
                      activeCategory === "community" ? null : "community"
                    );
                  }
                }}
              >
                <span>커뮤니티</span>
                <span
                  className={`transform transition-transform duration-200 ${activeCategory === "community" ? "rotate-180" : ""}`}
                >
                  ▼
                </span>
              </div>
              <div
                className={`pl-4 space-y-2 overflow-hidden transition-all duration-300 ${
                  activeCategory === "community" ? "max-h-48 mt-2" : "max-h-0"
                }`}
              >
                {communitySubMenu.map((item) => (
                  <Link
                    key={item.name}
                    href={item.link}
                    className="block py-1 text-gray-600 hover:text-blue-600"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* 랭킹 섹션 */}
            <div>
              <div
                className="flex items-center justify-between py-2 cursor-pointer hover:text-blue-600"
                onClick={() => {
                  if (activeCategory === "ranking") {
                    window.location.href = "/ranking/level";
                  } else {
                    setActiveCategory(
                      activeCategory === "ranking" ? null : "ranking"
                    );
                  }
                }}
              >
                <span>랭킹</span>
                <span
                  className={`transform transition-transform duration-200 ${activeCategory === "ranking" ? "rotate-180" : ""}`}
                >
                  ▼
                </span>
              </div>
              <div
                className={`pl-4 space-y-2 overflow-hidden transition-all duration-300 ${
                  activeCategory === "ranking" ? "max-h-48 mt-2" : "max-h-0"
                }`}
              >
                {rankingSubMenu.map((item) => (
                  <Link
                    key={item.name}
                    href={item.link}
                    className="block py-1 text-gray-600 hover:text-blue-600"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

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

// app/my/basic/page.tsx
"use client";

import { useEffect, useState } from "react";
import DashboardHeader from "@/components/layout/DashboardHeader";
import MenuNavigation from "@/components/layout/MenuNavigation";
import CharacterInfo from "@/components/user/CharacterInfo";
import Footer from "@/components/layout/Footer";

import { getUserInfo } from "@/apis/api/getUserInfo";
import type { UserInfo } from "@/types/userInfo";
import BasicInfoContent from "@/components/user/BasicInfoContent";
import BasicInfoSkeletonLoading from "@/components/skeleton/BasicInfoSkeletonLoading";

export default function BasicInfoPage() {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
          alert("로그인을 먼저 진행해주세요!");
          window.location.href = "/auth";
          return;
        }

        const info = await getUserInfo();
        setUserInfo(info);
      } catch (error) {
        console.error("데이터 로드 실패:", error);
        if (error instanceof Error && error.message === "토큰이 없습니다.") {
          window.location.href = "/auth";
        }
      } finally {
        setTimeout(() => setLoading(false), 100);
      }
    };

    fetchData();
  }, []);

  if (loading || !userInfo) {
    return <BasicInfoSkeletonLoading />;
  }

  return (
    <div className="flex flex-col min-h-screen animate-fade-in">
      <DashboardHeader />

      <div className="w-full h-px bg-gray-200"></div>

      <div className="container flex-grow px-6 py-8 mx-auto max-w-7xl">
        <CharacterInfo />

        <div className="w-full h-px my-8 bg-gray-200"></div>

        {/* flex 컨테이너에 justify-center 추가 */}
        <div className="flex justify-center gap-8">
          {/* 좌측 메뉴 너비 고정 */}
          <div className="w-48 shrink-0">
            <MenuNavigation currentMenu="기본 정보" />
          </div>

          <div className="w-full max-w-[960px]">
            <BasicInfoContent userInfo={userInfo} />
          </div>

          <div className="w-48 shrink-0"></div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
